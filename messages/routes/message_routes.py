from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Query
from typing import List, Optional, Dict, Any
import json
from bson import ObjectId
from datetime import datetime

from ..schemas import (
    MessageCreate, MessageResponse, 
    ConversationCreate, ConversationResponse, 
    ConversationDetail
)
from ..services.message_service import message_service
from ..utils.websocket_manager import manager

router = APIRouter()

# Helper function to convert MongoDB ObjectId to string
def serialize_mongodb_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB document to a serializable dictionary"""
    if doc is None:
        return None
    
    result = dict(doc)
    if "_id" in result:
        result["id"] = str(result["_id"])
        del result["_id"]
    
    # Convert datetime objects to string
    for key, value in result.items():
        if isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, ObjectId):
            result[key] = str(value)
    
    return result

@router.post("/messages/", response_model=MessageResponse)
async def create_message(message: MessageCreate):
    """Create a new message"""
    db_message = message_service.create_message(message)
    
    # Serialize message for WebSocket
    serialized_message = serialize_mongodb_doc(db_message)
    
    # Notify via WebSockets
    await manager.broadcast_to_conversation(
        {
            "type": "new_message",
            "message": serialized_message
        },
        message.conversation_id,
        exclude_user_id=message.sender_id
    )
    
    return serialized_message

@router.get("/messages/{message_id}", response_model=MessageResponse)
async def get_message(message_id: str):
    """Get a message by ID"""
    message = message_service.get_message(message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return serialize_mongodb_doc(message)

@router.put("/messages/{message_id}/read", response_model=dict)
async def mark_message_as_read(message_id: str):
    """Mark a message as read"""
    success = message_service.mark_message_as_read(message_id)
    return {"success": success}

@router.put("/conversations/{conversation_id}/read", response_model=dict)
async def mark_conversation_as_read(conversation_id: str, user_id: int):
    """Mark all messages in a conversation as read for a user"""
    count = message_service.mark_conversation_messages_as_read(conversation_id, user_id)
    return {"success": True, "read_count": count}

@router.post("/conversations/", response_model=ConversationResponse)
async def create_conversation(conversation: ConversationCreate):
    """Create a new conversation"""
    db_conversation = message_service.create_conversation(conversation)
    return serialize_mongodb_doc(db_conversation)

@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(conversation_id: str):
    """Get a conversation by ID, including its messages"""
    conversation = message_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Convert to serializable format
    result = serialize_mongodb_doc(conversation)
    
    # Add messages to response
    messages = message_service.get_conversation_messages(conversation_id)
    result["messages"] = [serialize_mongodb_doc(msg) for msg in messages]
    
    return result

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: str, 
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get messages in a conversation with pagination"""
    messages = message_service.get_conversation_messages(conversation_id)
    
    # Apply pagination
    start = min(offset, len(messages))
    end = min(offset + limit, len(messages))
    
    # Serialize messages for response
    return [serialize_mongodb_doc(msg) for msg in messages[start:end]]

@router.get("/users/{user_id}/conversations", response_model=List[ConversationResponse])
async def get_user_conversations(user_id: int):
    """Get all conversations for a user"""
    conversations = message_service.get_user_conversations(user_id)
    return [serialize_mongodb_doc(conv) for conv in conversations]

@router.get("/users/{user_id}/unread", response_model=Dict[str, int])
async def get_unread_message_count(user_id: int):
    """Get unread message count for a user, grouped by conversation"""
    unread_counts = message_service.get_unread_message_count(user_id)
    # MongoDB already returns string keys
    return unread_counts

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """WebSocket endpoint for real-time communication"""
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            
            # Parse the WebSocket message
            try:
                message_data = json.loads(data)
                message_type = message_data.get("type", "")
                
                # Handle different message types
                if message_type == "typing_status":
                    conversation_id = message_data.get("conversation_id")
                    is_typing = message_data.get("is_typing", False)
                    if conversation_id:
                        await manager.set_typing_status(user_id, conversation_id, is_typing)
                
                elif message_type == "active_conversation":
                    conversation_id = message_data.get("conversation_id")
                    await manager.set_active_conversation(user_id, conversation_id)
                
                # Echo the message
                await websocket.send_text(f"Message received: {data}")
                
            except json.JSONDecodeError:
                await websocket.send_text(f"Invalid JSON: {data}")
    
    except WebSocketDisconnect:
        await manager.disconnect(websocket, user_id) 