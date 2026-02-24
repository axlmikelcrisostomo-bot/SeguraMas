"""Authentication Routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import logging

from app.database.models import User
from app.database.database import get_db
from app.schemas import UserLogin, UserRegister, UserResponse, TokenResponse
from app.security import verify_password, hash_password, create_access_token, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """User login endpoint"""
    try:
        # Query user by email
        result = await db.execute(select(User).where(User.email == credentials.email))
        user = result.scalars().first()

        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        # Create access token
        access_token = create_access_token(data={"sub": user.email, "user_id": user.id})

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=86400,  # 24 hours in seconds
            user=UserResponse.from_orm(user),
        )

    except HTTPException:
        raise
    except Exception as err:
        logger.error(f"Login error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed",
        )


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """User registration endpoint"""
    try:
        # Check if user exists
        result = await db.execute(select(User).where(User.email == user_data.email))
        existing_user = result.scalars().first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Create new user
        new_user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            name=user_data.name or user_data.email.split("@")[0],
            role="user",
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        # Create access token
        access_token = create_access_token(data={"sub": new_user.email, "user_id": new_user.id})

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=86400,  # 24 hours in seconds
            user=UserResponse.from_orm(new_user),
        )

    except HTTPException:
        await db.rollback()
        raise
    except Exception as err:
        await db.rollback()
        logger.error(f"Registration error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed",
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Refresh access token endpoint"""
    try:
        # Fetch user from database to get latest info
        result = await db.execute(select(User).where(User.id == current_user.user_id))
        user = result.scalars().first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        new_token = create_access_token(
            data={"sub": user.email, "user_id": user.id}
        )

        return TokenResponse(
            access_token=new_token,
            token_type="bearer",
            user=UserResponse.from_orm(user),
        )

    except HTTPException:
        raise
    except Exception as err:
        logger.error(f"Token refresh error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed",
        )


# Dependency for protected routes
async def get_current_user_deprecated(db: AsyncSession = Depends(get_db)):
    """Get current authenticated user (deprecated - use security.get_current_user instead)"""
    return {"email": "user@example.com", "user_id": 1}
