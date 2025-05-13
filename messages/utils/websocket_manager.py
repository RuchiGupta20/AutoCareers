from fastapi import WebSocket
from typing import Dict, List, Set, Optional, Union

class ConnectionManager:
    def __init__(self):
        # Store active connections: user_id -> List[WebSocket connections]
        self.active_connections: Dict[int, List[WebSocket]] = {}
        
        # Track which conversations each user is viewing
        self.user_active_conversations: Dict[int, Optional[str]] = {}
        
        # Track typing status: conversation_id -> Set[user_ids_typing]
        self.typing_status: Dict[str, Set[int]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept connection and add to active connections"""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        # Default is not actively viewing any conversation
        self.user_active_conversations[user_id] = None

    async def disconnect(self, websocket: WebSocket, user_id: int):
        """Remove connection when disconnected"""
        self.active_connections[user_id].remove(websocket)
        if not self.active_connections[user_id]:
            del self.active_connections[user_id]
            if user_id in self.user_active_conversations:
                del self.user_active_conversations[user_id]
                
            # Remove from typing status in all conversations
            for conversation_id, typing_users in list(self.typing_status.items()):
                if user_id in typing_users:
                    typing_users.remove(user_id)
                    await self.broadcast_typing_status(conversation_id)

    async def set_active_conversation(self, user_id: int, conversation_id: Optional[str]):
        """Track which conversation a user is currently viewing"""
        self.user_active_conversations[user_id] = conversation_id

    async def send_personal_message(self, message: dict, user_id: int):
        """Send a message to a specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)
    
    async def broadcast_to_conversation(self, message: dict, conversation_id: str, exclude_user_id: Optional[int] = None):
        """Send a message to all participants in a conversation"""
        for user_id, connections in self.active_connections.items():
            if user_id != exclude_user_id:
                for connection in connections:
                    await connection.send_json(message)
    
    async def set_typing_status(self, user_id: int, conversation_id: str, is_typing: bool):
        """Update typing status for a user in a conversation"""
        if conversation_id not in self.typing_status:
            self.typing_status[conversation_id] = set()
            
        if is_typing:
            self.typing_status[conversation_id].add(user_id)
        elif user_id in self.typing_status[conversation_id]:
            self.typing_status[conversation_id].remove(user_id)
            
        await self.broadcast_typing_status(conversation_id)
    
    async def broadcast_typing_status(self, conversation_id: str):
        """Broadcast typing status updates to all participants in a conversation"""
        typing_users = list(self.typing_status.get(conversation_id, set()))
        
        message = {
            "type": "typing_status", 
            "conversation_id": conversation_id,
            "users_typing": typing_users
        }
        
        await self.broadcast_to_conversation(message, conversation_id)


# Create a singleton instance
manager = ConnectionManager() 