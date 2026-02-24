"""JWT Authentication module"""
from datetime import datetime, timedelta
from typing import Optional
import jwt
from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from app.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
ALGORITHM = "HS256"
security = HTTPBearer()


class TokenData:
    """Token payload data"""
    
    def __init__(self, user_id: str, email: str, store_id: Optional[str] = None):
        self.user_id = user_id
        self.email = email
        self.store_id = store_id


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create JWT access token
    
    Args:
        data: Claims to encode in token
        expires_delta: Token expiration time
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=ALGORITHM
    )
    
    return encoded_jwt


def verify_token(token: str) -> TokenData:
    """
    Verify and decode JWT token
    
    Args:
        token: JWT token to verify
        
    Returns:
        TokenData with decoded claims
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[ALGORITHM]
        )
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        store_id: Optional[str] = payload.get("store_id")
        
        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token claims",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return TokenData(
            user_id=user_id,
            email=email,
            store_id=store_id
        )
        
    except PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenData:
    """
    Dependency to get current authenticated user
    
    Args:
        credentials: HTTP Bearer token from request
        
    Returns:
        TokenData of authenticated user
        
    Raises:
        HTTPException: If token is invalid or missing
    """
    token = credentials.credentials
    return verify_token(token)


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[TokenData]:
    """
    Dependency to get current user if authenticated
    
    Args:
        credentials: HTTP Bearer token from request (optional)
        
    Returns:
        TokenData if authenticated, None otherwise
    """
    if credentials is None:
        return None
    
    return verify_token(credentials.credentials)


async def check_store_access(
    current_user: TokenData = Depends(get_current_user),
    store_id: str = None
) -> bool:
    """
    Verify user has access to a specific store
    
    Args:
        current_user: Current authenticated user
        store_id: Store ID to verify access for
        
    Returns:
        True if user has access
        
    Raises:
        HTTPException: If access denied
    """
    if store_id and current_user.store_id != store_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this store"
        )
    
    return True
