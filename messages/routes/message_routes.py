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
from ..utils.api_mappers import (
    map_message_to_frontend,
    map_conversation_to_frontend,
    map_user_to_frontend,
    serialize_mongodb_doc
)
from ..models.database import get_users_collection

router = APIRouter()

@router.post("/messages/", response_model=MessageResponse)
async def create_message(message: MessageCreate):
    """Create a new message"""
    db_message = message_service.create_message(message)
    
    # Map to frontend format
    frontend_message = map_message_to_frontend(db_message)
    
    # Notify via WebSockets
    await manager.broadcast_to_conversation(
        {
            "type": "new_message",
            "message": frontend_message
        },
        message.conversation_id,
        exclude_user_id=message.sender_id
    )
    
    return frontend_message

@router.get("/messages/{message_id}", response_model=MessageResponse)
async def get_message(message_id: str):
    """Get a message by ID"""
    message = message_service.get_message(message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return map_message_to_frontend(message)

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
    
    # Get user details for participants
    users_collection = get_users_collection()
    user_ids = [p.get("user_id") for p in db_conversation.get("participants", [])]
    users_map = {}
    
    for user_id in user_ids:
        user = users_collection.find_one({"user_id": user_id})
        if user:
            users_map[user_id] = map_user_to_frontend(user)
    
    return map_conversation_to_frontend(db_conversation, users_map)

@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(conversation_id: str):
    """Get a conversation by ID, including its messages"""
    conversation = message_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Get messages
    messages = message_service.get_conversation_messages(conversation_id)
    
    # Get user details for participants
    users_collection = get_users_collection()
    user_ids = [p.get("user_id") for p in conversation.get("participants", [])]
    users_map = {}
    
    for user_id in user_ids:
        user = users_collection.find_one({"user_id": user_id})
        if user:
            users_map[user_id] = map_user_to_frontend(user)
    
    return map_conversation_to_frontend(
        conversation, 
        users_map, 
        include_messages=True, 
        messages=messages
    )

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
    
    # Map to frontend format
    return [map_message_to_frontend(msg) for msg in messages[start:end]]

@router.get("/users/{user_id}/conversations", response_model=List[ConversationResponse])
async def get_user_conversations(user_id: int):
    """Get all conversations for a user"""
    conversations = message_service.get_user_conversations(user_id)
    
    # Get user details for all participants in all conversations
    users_collection = get_users_collection()
    all_user_ids = set()
    
    for conv in conversations:
        for participant in conv.get("participants", []):
            all_user_ids.add(participant.get("user_id"))
    
    # Build user map
    users_map = {}
    for user_id in all_user_ids:
        user = users_collection.find_one({"user_id": user_id})
        if user:
            users_map[user_id] = map_user_to_frontend(user)
    
    # Map conversations to frontend format
    return [map_conversation_to_frontend(conv, users_map) for conv in conversations]

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