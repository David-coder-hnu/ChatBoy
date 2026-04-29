from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user_id
from app.schemas.clone_profile import DistillationInput, CloneProfileOut

router = APIRouter()


@router.post("/start")
async def start_distillation(
    data: DistillationInput,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Start AI distillation process for current user"""
    # Will trigger Celery task for actual distillation
    return {"status": "started", "user_id": user_id}


@router.get("/status")
async def get_distillation_status(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get current distillation progress"""
    return {"status": "in_progress", "completion_score": 0.0}


@router.get("/profile", response_model=CloneProfileOut)
async def get_profile(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get distilled clone profile"""
    # Placeholder
    return {
        "id": "00000000-0000-0000-0000-000000000000",
        "user_id": user_id,
        "completion_score": 0.0,
        "is_activated": False,
        "distilled_persona": {},
        "chat_dna": {},
        "system_prompt": "",
        "autonomy_level": 7,
        "created_at": "2024-01-01T00:00:00Z",
    }
