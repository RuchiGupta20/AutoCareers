from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException

from ..models.models import Message, Conversation, User
from ..models.database import get_messages_collection, get_conversations_collection, get_users_collection
from ..schemas import MessageCreate, ConversationCreate

class MessageService:
    def create_message(self, message: MessageCreate) -> Dict[str, Any]:
        """Create a new message in a conversation"""
        # Get collections
        conversations = get_conversations_collection()
        messages = get_messages_collection()
        
        # Check if the conversation exists
        conversation = conversations.find_one({"_id": ObjectId(message.conversation_id)})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Create the message document
        message_doc = Message.create(
            conversation_id=message.conversation_id,
            sender_id=message.sender_id,
            sender_type=message.sender_type,
            content=message.content
        )
        
        # Insert into MongoDB
        result = messages.insert_one(message_doc)
        message_doc["_id"] = result.inserted_id
        
        # Update the conversation updated_at timestamp
        conversations.update_one(
            {"_id": ObjectId(message.conversation_id)},
            {"$set": {"updated_at": datetime.now()}}
        )
        
        return message_doc

    def get_message(self, message_id: str) -> Optional[Dict[str, Any]]:
        """Get a message by ID"""
        messages = get_messages_collection()
        message = messages.find_one({"_id": ObjectId(message_id)})
        return message

    def get_conversation_messages(self, conversation_id: str) -> List[Dict[str, Any]]:
        """Get all messages in a conversation"""
        messages = get_messages_collection()
        # Convert ObjectId to string if needed
        conv_id = conversation_id if isinstance(conversation_id, str) else str(conversation_id)
        cursor = messages.find({"conversation_id": conv_id}).sort("timestamp", 1)
        return list(cursor)
    
    def mark_message_as_read(self, message_id: str) -> bool:
        """Mark a message as read"""
        messages = get_messages_collection()
        result = messages.update_one(
            {"_id": ObjectId(message_id)},
            {"$set": {"read_status": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return True
    
    def mark_conversation_messages_as_read(self, conversation_id: str, user_id: int) -> int:
        """Mark all messages in a conversation as read for a specific user"""
        messages = get_messages_collection()
        # Only mark messages as read if user is not the sender
        result = messages.update_many(
            {
                "conversation_id": conversation_id,
                "sender_id": {"$ne": user_id},
                "read_status": False
            },
            {"$set": {"read_status": True}}
        )
        
        return result.modified_count
    
    def create_conversation(self, conversation: ConversationCreate) -> Dict[str, Any]:
        """Create a new conversation between participants"""
        # Validate participant count
        if len(conversation.participant_ids) != len(conversation.participant_types):
            raise HTTPException(status_code=400, detail="Participant IDs and types must be the same length")
        
        # Get collections
        conversations = get_conversations_collection()
        users = get_users_collection()
        
        # Create participants list
        participants = []
        for user_id, user_type in zip(conversation.participant_ids, conversation.participant_types):
            # Ensure the user exists
            user = users.find_one({"user_id": user_id})
            if not user:
                # Create placeholder user if needed
                user_doc = User.create(
                    user_id=user_id,
                    username=f"user_{user_id}",
                    email=f"user_{user_id}@example.com",
                    user_type=user_type
                )
                users.insert_one(user_doc)
            
            # Add to participants list
            participants.append({
                "user_id": user_id,
                "user_type": user_type
            })
        
        # Create conversation document
        conversation_doc = Conversation.create(
            title=conversation.title, 
            participants=participants
        )
        
        # Insert into MongoDB
        result = conversations.insert_one(conversation_doc)
        conversation_doc["_id"] = result.inserted_id
        
        return conversation_doc
    
    def get_conversation(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        """Get a conversation by ID"""
        conversations = get_conversations_collection()
        conversation = conversations.find_one({"_id": ObjectId(conversation_id)})
        return conversation
    
    def get_user_conversations(self, user_id: int) -> List[Dict[str, Any]]:
        """Get all conversations for a user"""
        conversations = get_conversations_collection()
        # Find conversations where the user is a participant
        cursor = conversations.find(
            {"participants.user_id": user_id}
        ).sort("updated_at", -1)  # -1 for descending
        
        return list(cursor)
    
    def get_conversation_between_users(self, user1_id: int, user2_id: int) -> Optional[Dict[str, Any]]:
        """Get an existing conversation between two users or None if it doesn't exist"""
        conversations = get_conversations_collection()
        
        # Find conversations where both users are participants
        conversation = conversations.find_one({
            "participants.user_id": {"$all": [user1_id, user2_id]},
            "participants": {"$size": 2}  # Make sure it's only between these two users
        })
        
        return conversation
    
    def get_unread_message_count(self, user_id: int) -> Dict[str, int]:
        """Get unread message count for a user, grouped by conversation"""
        messages = get_messages_collection()
        
        # Get all conversations for the user
        conversations = self.get_user_conversations(user_id)
        
        # Get unread message count for each conversation
        result = {}
        for conversation in conversations:
            conv_id = str(conversation["_id"])
            count = messages.count_documents({
                "conversation_id": conv_id,
                "sender_id": {"$ne": user_id},
                "read_status": False
            })
            
            if count > 0:
                result[conv_id] = count
        
        return result

# Create a singleton instance
message_service = MessageService() 