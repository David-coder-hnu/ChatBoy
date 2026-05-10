"""Unit tests for ActionPlanner — personality-driven behavior decisions."""
import pytest
from app.ai.clone_engine.action_planner import ActionPlanner


def _make_clone_state(social_initiative="medium", autonomy=1, pending_msgs=0,
                      relationships=None):
    return {
        "clone_id": "test-clone-1",
        "autonomy_level": autonomy,
        "persona": {
            "decision_patterns": {
                "social_initiative": social_initiative,
            },
            "chat_dna": {
                "response_patterns": {
                    "reply_latency": "thoughtful",
                },
            },
        },
        "pending_messages": [
            {
                "id": f"msg-{i}",
                "conversation_id": f"conv-{i}",
                "is_read": False,
            }
            for i in range(pending_msgs)
        ],
        "active_relationships": relationships or [],
    }


class TestReplyPriority:
    @pytest.mark.anyio
    async def test_always_replies_to_pending_messages(self):
        planner = ActionPlanner()
        state = _make_clone_state(pending_msgs=2, autonomy=1)
        actions = await planner.plan_actions(state)
        replies = [a for a in actions if a["type"] == "reply"]
        assert len(replies) == 2, f"Expected 2 replies, got {len(replies)}"

    @pytest.mark.anyio
    async def test_skips_read_messages(self):
        planner = ActionPlanner()
        state = _make_clone_state(pending_msgs=1, autonomy=1)
        state["pending_messages"][0]["is_read"] = True
        actions = await planner.plan_actions(state)
        replies = [a for a in actions if a["type"] == "reply"]
        assert len(replies) == 0


class TestInitiativeBehavior:
    @pytest.mark.anyio
    async def test_high_initiative_actions_are_well_structured(self):
        planner = ActionPlanner()
        state = _make_clone_state(social_initiative="high", autonomy=4, pending_msgs=1)
        state["active_relationships"] = [
            {"conversation_id": "c1", "intimacy_score": 80, "other_user_id": "u2"}
        ]
        actions = await planner.plan_actions(state)
        # At minimum, pending messages always produce reply actions
        assert len(actions) >= 1
        # Every action must be well-structured
        for a in actions:
            assert "type" in a
            assert "priority" in a
            assert "delay_seconds" in a
            assert a["delay_seconds"] > 0

    @pytest.mark.anyio
    async def test_low_initiative_autonomy_1_only_replies(self):
        planner = ActionPlanner()
        state = _make_clone_state(social_initiative="low", autonomy=1)
        actions = await planner.plan_actions(state)
        # Should only have reply actions (if any pending) or nothing
        non_reply = [a for a in actions if a["type"] != "reply"]
        assert len(non_reply) == 0, f"Expected no proactive actions, got {non_reply}"
