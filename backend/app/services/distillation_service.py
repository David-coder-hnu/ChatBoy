from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.models.clone_profile import CloneProfile
from app.models.clone import Clone
from app.models.distillation_job import DistillationJob
from app.models.calibration_refinement import CalibrationRefinement
from app.ai.distillation.persona_distiller import PersonaDistiller
from app.ai.distillation.style_extractor import StyleExtractor
from app.ai.distillation.prompt_forge import PromptForge
from app.ai.distillation.validation import DistillationValidator
from app.ai.fidelity_scorer import FidelityScorer
from app.ai.utils import truncate_chat_samples, redact_chat_samples


class DistillationService:
    def __init__(self):
        self.distiller = PersonaDistiller()
        self.style_extractor = StyleExtractor()
        self.forge = PromptForge()
        self.validator = DistillationValidator()
        self.fidelity = FidelityScorer()

    async def distill_user(
        self,
        user_id: str,
        questionnaire: dict,
        chat_samples: list[str],
        social_import: str | None,
        db: AsyncSession,
        progress_callback: callable | None = None,
    ):
        """
        Run the full distillation pipeline with fidelity scoring.
        """
        # Token-budget truncation + PII redaction
        chat_samples = truncate_chat_samples(chat_samples, max_chars=8000)
        chat_samples = redact_chat_samples(chat_samples)

        # Step 1: Deep persona distillation (4D, now parallel)
        distilled = await self.distiller.distill(
            questionnaire, chat_samples, social_import, use_4d=True
        )
        if progress_callback:
            await progress_callback("extracting_style", 40)

        # Step 2: Style fingerprint extraction
        style_analysis = await self.style_extractor.extract(chat_samples)
        if progress_callback:
            await progress_callback("forging_prompt", 60)

        # Step 3: Forge the system prompt
        forged = await self.forge.forge(distilled, style_analysis)
        if progress_callback:
            await progress_callback("validating", 80)

        # Step 4: Quality validation
        system_prompt = forged.get("system_prompt", "")
        validation = await self.validator.validate(system_prompt, chat_samples or [])

        scores = [
            validation.get("consistency_score", 0),
            validation.get("stability_score", 0),
            validation.get("safety_score", 0),
            validation.get("plausibility_score", 0),
        ]
        overall_score = sum(scores) / max(len(scores), 1)

        if progress_callback:
            await progress_callback("computing_fidelity", 90)

        # Step 4.5: Compute fidelity score
        base_consistency = self.fidelity.score_base_consistency(questionnaire)
        questionnaire_completeness = _questionnaire_completeness(questionnaire)
        calibration_iterations = await _count_calibrations(user_id, db)
        calibration_depth = self.fidelity.score_calibration_depth(
            questionnaire_completeness=questionnaire_completeness,
            chat_sample_count=len(chat_samples or []),
            calibration_iterations=calibration_iterations,
            social_import_provided=bool(social_import),
        )
        # Behavioral alignment starts at baseline until clone generates responses
        fidelity_result = self.fidelity.compute_fidelity(
            base_consistency=base_consistency,
            behavioral_alignment=50.0,  # Baseline; updated via calibration loop
            calibration_depth=calibration_depth,
        )

        if progress_callback:
            await progress_callback("persisting", 95)

        # Step 5: Save to database
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise ValueError("User not found")

        existing_result = await db.execute(
            select(CloneProfile).where(CloneProfile.user_id == user_id)
        )
        existing = existing_result.scalar_one_or_none()
        new_version = (existing.version + 1) if existing else 1

        profile = CloneProfile(
            user_id=user_id,
            questionnaire_answers=questionnaire,
            chat_samples=chat_samples,
            social_import=social_import,
            distilled_persona=distilled.get("persona_core", {}),
            chat_dna=distilled.get("chat_dna", {}),
            emotional_triggers=distilled.get("persona_core", {}).get(
                "emotional_vulnerabilities"
            ),
            decision_patterns=distilled.get("decision_patterns", {}),
            memory_seed=distilled.get("memory_seed", ""),
            system_prompt=system_prompt,
            voice_prompt=forged.get("voice_prompt"),
            behavior_rules=forged.get("behavior_rules", {}),
            autonomy_level=7,
            completion_score=overall_score,
            is_activated=overall_score >= 70,
            version=new_version,
            fidelity_score=fidelity_result["overall"],
            fidelity_meta=fidelity_result,
            distillation_meta={
                "model_version": "gpt-4o",
                "distilled_via": "async_pipeline",
            },
            distilled_at=datetime.now(timezone.utc),
        )
        db.add(profile)
        await db.flush()

        # Create or update clone runtime record
        clone_result = await db.execute(
            select(Clone).where(Clone.user_id == user_id)
        )
        clone = clone_result.scalar_one_or_none()
        if clone:
            clone.profile_id = profile.id
            clone.status = "dormant" if overall_score < 70 else "active"
        else:
            clone = Clone(
                user_id=user_id,
                profile_id=profile.id,
                name=f"{user.nickname or 'User'}的在线状态",
                status="dormant" if overall_score < 70 else "active",
            )
            db.add(clone)

        await db.commit()

        return {
            "profile": profile,
            "validation": validation,
            "overall_score": overall_score,
            "fidelity": fidelity_result,
        }

    # ------------------------------------------------------------------
    # Calibration refinement
    # ------------------------------------------------------------------

    async def refine_from_correction(
        self,
        user_id: str,
        correction_context: dict,
        db: AsyncSession,
    ) -> dict:
        """
        Refine the clone's persona when the user corrects a clone response.

        correction_context should include:
          - original_response: str — what the clone said
          - corrected_response: str — what the user would have said
          - conversation_context: dict — the conversation context at the time
          - correction_note: str | None — user's explanation of the correction
        """
        # Load current profile
        result = await db.execute(
            select(CloneProfile)
            .where(CloneProfile.user_id == user_id)
            .order_by(CloneProfile.version.desc())
        )
        profile = result.scalar_one_or_none()
        if not profile:
            raise ValueError("No clone profile found — run distillation first")

        # Extract the relevant style dimensions that the correction updates
        original_resp = correction_context.get("original_response", "")
        corrected_resp = correction_context.get("corrected_response", "")
        correction_note = correction_context.get("correction_note", "")

        # Update behavioral alignment score using embedding comparison
        if original_resp and corrected_resp:
            alignment = await self.fidelity.score_behavioral_alignment(
                real_messages=[corrected_resp],
                clone_responses=[original_resp],
            )
        else:
            alignment = 50.0

        # Recompute composite fidelity with updated alignment
        base_consistency = self.fidelity.score_base_consistency(
            (profile.questionnaire_answers or {})
        )
        questionnaire_completeness = _questionnaire_completeness(
            profile.questionnaire_answers or {}
        )
        calibration_count = await _count_calibrations(user_id, db) + 1
        calibration_depth = self.fidelity.score_calibration_depth(
            questionnaire_completeness=questionnaire_completeness,
            chat_sample_count=len(profile.chat_samples or []),
            calibration_iterations=calibration_count,
            social_import_provided=bool(profile.social_import),
        )
        fidelity_result = self.fidelity.compute_fidelity(
            base_consistency=base_consistency,
            behavioral_alignment=alignment,
            calibration_depth=calibration_depth,
        )

        # Update profile fidelity
        profile.fidelity_score = fidelity_result["overall"]
        profile.fidelity_meta = fidelity_result
        profile.version += 1

        # Record the calibration event
        refinement = CalibrationRefinement(
            user_id=user_id,
            profile_version=profile.version,
            previous_prompt=original_resp[:500] if original_resp else None,
            refined_prompt=corrected_resp[:500] if corrected_resp else None,
            changes_made=[correction_note] if correction_note else [],
            confidence=round(alignment / 100, 2),
        )
        db.add(refinement)
        await db.commit()

        return {
            "fidelity": fidelity_result,
            "behavioral_alignment": alignment,
            "calibration_count": calibration_count,
        }

    # ------------------------------------------------------------------
    # Job management
    # ------------------------------------------------------------------

    async def get_active_job(
        self, user_id: str, db: AsyncSession
    ) -> DistillationJob | None:
        """Return any queued or running distillation job for the user."""
        result = await db.execute(
            select(DistillationJob)
            .where(DistillationJob.user_id == user_id)
            .where(DistillationJob.status.in_(["queued", "running"]))
            .order_by(DistillationJob.created_at.desc())
        )
        return result.scalar_one_or_none()


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

def _questionnaire_completeness(questionnaire: dict) -> float:
    if not questionnaire:
        return 0.0
    answered = sum(
        1 for v in questionnaire.values()
        if v is not None and v != "" and v != []
    )
    return answered / max(len(questionnaire), 1)


async def _count_calibrations(user_id: str, db: AsyncSession) -> int:
    result = await db.execute(
        select(CalibrationRefinement).where(
            CalibrationRefinement.user_id == user_id
        )
    )
    return len(result.scalars().all())
