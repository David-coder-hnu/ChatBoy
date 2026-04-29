from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user_id
from app.schemas.date_invite import DateInviteCreate, DateInviteOut

router = APIRouter()


@router.get("/")
async def list_date_invites(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """List date invites"""
    return {"items": []}


@router.post("/{invite_id}/respond")
async def respond_to_invite(
    invite_id: str,
    decision: str,  # accepted, declined
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Respond to a date invite"""
    return {"status": decision}
