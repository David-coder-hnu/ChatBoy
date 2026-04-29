from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user_id
from app.schemas.clone import CloneOut, CloneConfigUpdate

router = APIRouter()


@router.get("/me", response_model=CloneOut)
async def get_my_clone(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's clone"""
    return {
        "id": "00000000-0000-0000-0000-000000000000",
        "user_id": user_id,
        "status": "dormant",
        "total_conversations": 0,
        "total_messages_sent": 0,
        "total_matches": 0,
        "total_posts": 0,
        "total_comments": 0,
        "created_at": "2024-01-01T00:00:00Z",
    }


@router.put("/me")
async def update_clone(
    data: CloneConfigUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Update clone configuration"""
    return {"status": "updated"}


@router.post("/me/activate")
async def activate_clone(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Activate clone to start socializing"""
    return {"status": "activated"}


@router.post("/me/deactivate")
async def deactivate_clone(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate clone"""
    return {"status": "deactivated"}
