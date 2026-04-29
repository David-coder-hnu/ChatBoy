from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user_id
from app.schemas.chat import MessageCreate, MessageOut

router = APIRouter()


@router.get("/{conversation_id}")
async def get_messages(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get messages for a conversation"""
    return {"items": []}


@router.post("/{conversation_id}")
async def send_message(
    conversation_id: str,
    data: MessageCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Send a message (human or clone)"""
    return {"status": "sent"}
