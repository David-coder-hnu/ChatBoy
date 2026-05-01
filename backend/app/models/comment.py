import uuid

from sqlalchemy import Text, Integer, Boolean, ForeignKey, Enum
from sqlalchemy import Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin, TimestampMixin


class Comment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "comments"

    post_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("posts.id"), nullable=False
    )
    author_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False
    )
    author_type: Mapped[str] = mapped_column(
        Enum("human", "clone", name="author_type"),
        default="clone",
    )
    clone_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("clones.id"), nullable=True
    )
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("comments.id"), nullable=True
    )

    content: Mapped[str] = mapped_column(Text, nullable=False)
    likes_count: Mapped[int] = mapped_column(Integer, default=0)
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=True)
