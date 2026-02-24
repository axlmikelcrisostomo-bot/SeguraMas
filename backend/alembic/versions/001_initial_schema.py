"""Initial database schema migration

Revision ID: 001
Revises: 
Create Date: 2026-02-22 10:00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create initial database schema"""
    
    # Create stores table
    op.create_table(
        'stores',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=True, index=True),
        sa.Column('country', sa.String(), nullable=True),
        sa.Column('subscription_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create cameras table
    op.create_table(
        'cameras',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('store_id', sa.String(), sa.ForeignKey('stores.id'), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('stream_url', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['store_id'], ['stores.id'])
    )
    
    # Create incidents table
    op.create_table(
        'incidents',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('camera_id', sa.String(), nullable=False, index=True),
        sa.Column('incident_type', sa.String(), nullable=False),
        sa.Column('risk_level', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), default=sa.func.now(), index=True),
        sa.Column('status', sa.String(), default='registered'),
        sa.Column('user_confirmed', sa.Boolean(), nullable=True),
        sa.Column('detection_data', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create alerts table
    op.create_table(
        'alerts',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('incident_id', sa.String(), sa.ForeignKey('incidents.id'), nullable=True),
        sa.Column('camera_id', sa.String(), nullable=False, index=True),
        sa.Column('risk_level', sa.String(), nullable=False),
        sa.Column('detection_summary', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), default=sa.func.now(), index=True),
        sa.Column('status', sa.String(), default='active'),
        sa.Column('notification_sent', sa.Boolean(), default=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['incident_id'], ['incidents.id'])
    )
    
    # Create detections table
    op.create_table(
        'detections',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('camera_id', sa.String(), nullable=False, index=True),
        sa.Column('timestamp', sa.DateTime(), default=sa.func.now(), index=True),
        sa.Column('class_name', sa.String(), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('box_coordinates', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Revert database schema"""
    op.drop_table('detections')
    op.drop_table('alerts')
    op.drop_table('incidents')
    op.drop_table('cameras')
    op.drop_table('stores')
