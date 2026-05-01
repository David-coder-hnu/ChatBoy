"""
Shared Redis client for caching, progress tracking, and pub/sub.
Uses fakeredis for local development without a real Redis server.
"""

from __future__ import annotations

import fakeredis.aioredis as aioredis

redis_client: aioredis.FakeRedis = aioredis.FakeRedis()


async def close_redis() -> None:
    pass
