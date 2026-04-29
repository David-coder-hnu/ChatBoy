from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user_id
from app.schemas.notification import NotificationOut

router = APIRouter()


@router.get("/")
async def list_notifications(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """List notifications"""
    return {"items": []}


@router.get("/stream")
async def notification_stream(
    user_id: str = Depends(get_current_user_id),
):
    """SSE stream for real-time notifications"""
    # Will implement SSE
    return {"status": "stream_started"}
