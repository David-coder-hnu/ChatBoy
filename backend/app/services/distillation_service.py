from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.models.clone_profile import CloneProfile
from app.models.clone import Clone
from app.ai.distillation.persona_distiller import PersonaDistiller
from app.ai.distillation.prompt_forge import PromptForge


class DistillationService:
    def __init__(self):
        self.distiller = PersonaDistiller()
        self.forge = PromptForge()

    async def distill_user(self, user_id: str, questionnaire: dict, chat_samples: list[str], social_import: str | None, db: AsyncSession):
        # Step 1: Distill persona
        distilled = await self.distiller.distill(questionnaire, chat_samples, social_import)

        # Step 2: Forge prompt
        forged = await self.forge.forge(distilled)

        # Step 3: Save to database
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise ValueError("User not found")

        profile = CloneProfile(
            user_id=user_id,
            questionnaire_answers=questionnaire,
            chat_samples=chat_samples,
            social_import=social_import,
            distilled_persona=distilled.get("persona_core", {}),
            chat_dna=distilled.get("chat_dna", {}),
            emotional_triggers=distilled.get("persona_core", {}).get("vulnerabilities"),
            decision_patterns=distilled.get("decision_patterns", {}),
            memory_seed=distilled.get("memory_seed", ""),
            system_prompt=forged.get("system_prompt", ""),
            voice_prompt=forged.get("voice_prompt"),
            behavior_rules=forged.get("behavior_rules", {}),
            autonomy_level=7,
            completion_score=100.0,
            is_activated=True,
        )
        db.add(profile)
        await db.flush()

        # Create clone runtime record
        clone = Clone(
            user_id=user_id,
            profile_id=profile.id,
            name=f"{user.nickname or 'User'}的孪生",
            status="dormant",
        )
        db.add(clone)

        # Update user status
        user.status = "active"
        await db.commit()

        return profile
