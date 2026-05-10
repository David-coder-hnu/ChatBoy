"""Add fidelity_score and fidelity_meta columns to clone_profiles.

Revision ID: 20260510_001
Create Date: 2026-05-10
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260510_001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "clone_profiles",
        sa.Column("fidelity_score", sa.DECIMAL(5, 2), nullable=True),
    )
    op.add_column(
        "clone_profiles",
        sa.Column("fidelity_meta", sa.JSON(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("clone_profiles", "fidelity_meta")
    op.drop_column("clone_profiles", "fidelity_score")
