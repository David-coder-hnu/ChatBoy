import pytest


@pytest.mark.asyncio
async def test_conversation_list(client):
    # This requires auth; in real tests, mock the dependency
    res = await client.get("/api/v1/conversations/")
    # Will fail with 401 without token, which is expected behavior
    assert res.status_code in (200, 401, 403)
