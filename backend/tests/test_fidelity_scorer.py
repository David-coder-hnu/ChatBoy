"""Unit tests for FidelityScorer."""
import pytest
from app.ai.fidelity_scorer import FidelityScorer


@pytest.fixture
def scorer():
    return FidelityScorer()


class TestBaseConsistency:
    def test_consistent_answers_scores_high(self, scorer):
        q = {"social_energy": 4, "social_avoidance": 2, "risk_love": 3, "caution": 3}
        score = scorer.score_base_consistency(q)
        assert score >= 60, f"Expected >= 60, got {score}"

    def test_contradictory_answers_scores_low(self, scorer):
        q = {"social_energy": 5, "social_avoidance": 5, "risk_love": 5, "caution": 5}
        score = scorer.score_base_consistency(q)
        assert score < 70, f"Expected < 70 for contradictory answers, got {score}"

    def test_empty_questionnaire_returns_50(self, scorer):
        assert scorer.score_base_consistency({}) == 50.0


class TestCalibrationDepth:
    def test_max_investment_scores_high(self, scorer):
        score = scorer.score_calibration_depth(
            questionnaire_completeness=1.0,
            chat_sample_count=50,
            calibration_iterations=10,
            social_import_provided=True,
        )
        assert score >= 90, f"Expected >= 90, got {score}"

    def test_minimal_investment_scores_low(self, scorer):
        score = scorer.score_calibration_depth(
            questionnaire_completeness=0.3,
            chat_sample_count=3,
            calibration_iterations=0,
            social_import_provided=False,
        )
        assert score < 40, f"Expected < 40, got {score}"


class TestComputeFidelity:
    def test_high_all_dimensions_gives_elite_tier(self, scorer):
        result = scorer.compute_fidelity(
            base_consistency=90,
            behavioral_alignment=88,
            calibration_depth=85,
        )
        assert result["tier"] == "精良级", f"Expected 精良级, got {result['tier']}"
        assert result["overall"] >= 85

    def test_low_all_dimensions_gives_calibrate_tier(self, scorer):
        result = scorer.compute_fidelity(
            base_consistency=20,
            behavioral_alignment=20,
            calibration_depth=10,
        )
        assert result["tier"] == "待校准", f"Expected 待校准, got {result['tier']}"

    def test_degraded_status_is_preserved(self, scorer):
        result = scorer.compute_fidelity(
            base_consistency=70,
            behavioral_alignment=50,
            calibration_depth=60,
            behavioral_status="degraded",
        )
        assert result["status"] == "degraded"

    def test_mid_range_gives_steady_tier(self, scorer):
        result = scorer.compute_fidelity(
            base_consistency=70,
            behavioral_alignment=68,
            calibration_depth=65,
        )
        assert result["tier"] == "稳固级", f"Expected 稳固级, got {result['tier']}"


class TestTierMapping:
    def test_85_plus_is_elite(self, scorer):
        assert scorer._score_to_tier(90)["label"] == "精良级"

    def test_65_to_85_is_steady(self, scorer):
        assert scorer._score_to_tier(70)["label"] == "稳固级"

    def test_40_to_65_is_basic(self, scorer):
        assert scorer._score_to_tier(50)["label"] == "初级"

    def test_below_40_is_calibrate(self, scorer):
        assert scorer._score_to_tier(30)["label"] == "待校准"
