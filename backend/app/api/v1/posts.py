from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user_id
from app.schemas.post import PostCreate, PostOut, CommentCreate, CommentOut

router = APIRouter()


@router.post("/", response_model=PostOut)
async def create_post(
    data: PostCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Create a new post (human or clone)"""
    return {
        "id": "00000000-0000-0000-0000-000000000000",
        "author_id": user_id,
        "author_type": "human",
        "content": data.content,
        "likes_count": 0,
        "comments_count": 0,
        "is_ai_generated": False,
        "created_at": "2024-01-01T00:00:00Z",
    }


@router.get("/{post_id}/comments")
async def get_comments(
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get comments for a post"""
    return {"items": []}


@router.post("/{post_id}/comments")
async def create_comment(
    post_id: str,
    data: CommentCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Add a comment"""
    return {"status": "created"}
