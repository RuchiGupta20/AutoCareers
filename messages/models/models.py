from datetime import datetime
from bson import ObjectId
from typing import Dict, List, Optional, Any

# MongoDB document schemas (these are not enforced by MongoDB but serve as documentation)

class Message:
    """Message document schema for MongoDB"""
    @staticmethod
    def create(conversation_id: str, sender_id: int, sender_type: str, content: str) -> Dict[str, Any]:
        """Create a new message document"""
        return {
            "conversation_id": conversation_id,
            "sender_id": sender_id,
            "sender_type": sender_type,  # 'recruiter' or 'applicant'
            "content": content,
            "timestamp": datetime.now(),
            "read_status": False
        }
    
    @staticmethod
    def from_dict(data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert dictionary to a message document with proper types"""
        return {
            "_id": data.get("_id", ObjectId()),
            "conversation_id": data.get("conversation_id"),
            "sender_id": data.get("sender_id"),
            "sender_type": data.get("sender_type"),
            "content": data.get("content"),
            "timestamp": data.get("timestamp", datetime.now()),
            "read_status": data.get("read_status", False)
        }

class Conversation:
    """Conversation document schema for MongoDB"""
    @staticmethod
    def create(title: Optional[str], participants: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create a new conversation document"""
        return {
            "title": title,
            "participants": participants,  # List of {"user_id": int, "user_type": str}
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    
    @staticmethod
    def from_dict(data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert dictionary to a conversation document with proper types"""
        return {
            "_id": data.get("_id", ObjectId()),
            "title": data.get("title"),
            "participants": data.get("participants", []),
            "created_at": data.get("created_at", datetime.now()),
            "updated_at": data.get("updated_at", datetime.now())
        }

class User:
    """User document schema for MongoDB"""
    @staticmethod
    def create(user_id: int, username: str, email: str, user_type: str) -> Dict[str, Any]:
        """Create a new user document"""
        return {
            "user_id": user_id,  # Using user_id to maintain compatibility with existing system
            "username": username,
            "email": email,
            "user_type": user_type  # 'recruiter' or 'applicant'
        }
    
    @staticmethod
    def from_dict(data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert dictionary to a user document with proper types"""
        return {
            "_id": data.get("_id", ObjectId()),
            "user_id": data.get("user_id"),
            "username": data.get("username"),
            "email": data.get("email"),
            "user_type": data.get("user_type")
        } 