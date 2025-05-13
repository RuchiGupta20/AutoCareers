from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    sender_id: int
    sender_type: str  # 'recruiter' or 'applicant'
    
class MessageCreate(MessageBase):
    conversation_id: str

class MessageResponse(MessageBase):
    id: str
    conversation_id: str
    timestamp: datetime
    read_status: bool
    
    class Config:
        from_attributes = True
        populate_by_name = True

class ConversationBase(BaseModel):
    title: Optional[str] = None

class ConversationCreate(ConversationBase):
    participant_ids: List[int]
    participant_types: List[str]  # List of 'recruiter' or 'applicant'

class ConversationResponse(ConversationBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    participants: Optional[List[dict]] = []
    
    class Config:
        from_attributes = True
        populate_by_name = True

class ConversationDetail(ConversationResponse):
    messages: List[MessageResponse] = []
    
    class Config:
        from_attributes = True
        populate_by_name = True

class UserBase(BaseModel):
    username: str
    email: str
    user_type: str  # 'recruiter' or 'applicant'

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    user_id: int
    
    class Config:
        from_attributes = True
        populate_by_name = True 