from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user_id
from app.schemas.match import MatchOut, MatchAction

router = APIRouter()


@router.get("/discover")
async def discover_matches(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Discover potential matches"""
    return {"items": []}


@router.get("/")
async def list_matches(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """List current user's matches"""
    return {"items": []}


@router.post("/{match_id}/action")
async def match_action(
    match_id: str,
    action: MatchAction,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Accept or reject a match"""
    return {"status": action.action}
