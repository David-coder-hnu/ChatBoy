from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user_id
from app.schemas.chat import ConversationOut

router = APIRouter()


@router.get("/", response_model=list[ConversationOut])
async def list_conversations(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """List user's conversations"""
    return []


@router.post("/{conversation_id}/takeover")
async def takeover(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Human takes over the conversation from clone"""
    return {"status": "takeover_started", "conversation_id": conversation_id}


@router.post("/{conversation_id}/release")
async def release(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Release conversation back to clone"""
    return {"status": "released", "conversation_id": conversation_id}
