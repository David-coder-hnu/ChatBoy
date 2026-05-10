import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.dependencies import get_db, get_current_user_id
from app.schemas.clone import CloneOut, CloneConfigUpdate
from app.services.clone_service import CloneService
from app.models.clone import Clone
from app.models.clone_action_log import CloneActionLog
from app.models.clone_profile import CloneProfile
from app.ai.llm_client import llm_client

router = APIRouter()


@router.get("/me", response_model=CloneOut)
async def get_my_clone(
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's clone"""
    service = CloneService(db)
    clone = await service.get_by_user_id(user_id)
    if not clone:
        raise HTTPException(status_code=404, detail="Clone not found")
    return clone


@router.put("/me")
async def update_clone(
    data: CloneConfigUpdate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Update clone configuration"""
    service = CloneService(db)
    clone = await service.update_config(
        user_id=user_id,
        name=data.name,
        autonomy_level=data.autonomy_level,
    )
    return clone


@router.post("/me/activate")
async def activate_clone(
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Activate clone to start socializing"""
    service = CloneService(db)
    clone = await service.activate(user_id)
    return {"status": "activated", "clone_id": str(clone.id)}


@router.post("/me/deactivate")
async def deactivate_clone(
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate clone"""
    service = CloneService(db)
    clone = await service.deactivate(user_id)
    return {"status": "deactivated", "clone_id": str(clone.id)}


@router.get("/me/activities")
async def get_clone_activities(
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    limit: int = 20,
):
    """Get recent clone activities for the dashboard timeline."""

    result = await db.execute(
        select(Clone).where(Clone.user_id == user_id)
    )
    clone = result.scalar_one_or_none()
    if not clone:
        raise HTTPException(status_code=404, detail="Clone not found")

    logs_result = await db.execute(
        select(CloneActionLog)
        .where(CloneActionLog.clone_id == clone.id)
        .order_by(desc(CloneActionLog.created_at))
        .limit(limit)
    )
    logs = logs_result.scalars().all()

    return [
        {
            "id": str(log.id),
            "action_type": log.action_type,
            "description": log.description,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]


@router.get("/me/daily-brief")
async def get_daily_brief(
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Generate a daily brief summary of clone activity in the user's own voice."""
    # Find the clone
    result = await db.execute(
        select(Clone).where(Clone.user_id == user_id)
    )
    clone = result.scalar_one_or_none()
    if not clone:
        raise HTTPException(status_code=404, detail="Clone not found")

    # Get today's activities
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    logs_result = await db.execute(
        select(CloneActionLog)
        .where(CloneActionLog.clone_id == clone.id)
        .where(CloneActionLog.created_at >= today)
        .order_by(desc(CloneActionLog.created_at))
        .limit(20)
    )
    logs = logs_result.scalars().all()

    if not logs:
        return {
            "brief": None,
            "activity_count": 0,
            "message": "你的孪生还在熟悉这个世界。等有人发来第一条消息，这里会变成你的每日简报。",
        }

    # Load clone profile for the system prompt (voice)
    profile_result = await db.execute(
        select(CloneProfile).where(CloneProfile.user_id == user_id)
    )
    profile = profile_result.scalar_one_or_none()
    system_prompt = profile.system_prompt if profile else ""

    # Build activity log for LLM
    activity_lines = []
    for log in logs:
        ts = log.created_at.strftime("%H:%M") if log.created_at else "未知时间"
        activity_lines.append(f"[{ts}] {log.action_type}: {log.description or log.action_type}")

    activities_text = "\n".join(activity_lines)

    prompt = f"""{system_prompt}

以下是你的孪生今天在 SoulClone 上的活动记录：

{activities_text}

请用你自己的语气写一份简短的每日简报（80-150字），总结今天孪生替你做了什么。
要求：
- 用第一人称（"我"）
- 像在跟自己说话一样自然
- 不要像产品周报，不要用"今日总结"、"汇报"之类的词
- 突出值得你关注的事，忽略琐碎的
- 如果没什么特别的，就说"今天比较安静"

只输出简报文本，不要其他内容。"""

    try:
        raw = await llm_client.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=200,
            task_type="daily_brief",
        )
        brief = raw if isinstance(raw, str) else ""
    except Exception:
        # LLM failure → simple fallback
        brief = f"今天和{len([lg for lg in logs if lg.action_type == 'message'])}个人聊了天。"

    return {
        "brief": brief,
        "activity_count": len(logs),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
