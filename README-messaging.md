# AutoCareers Messaging System

A real-time messaging platform that enables communication between recruiters and applicants, built with FastAPI and MongoDB.

## Features

- MongoDB-based database for scalable data storage
- Real-time messaging using WebSockets
- Conversation management
- Message read status tracking
- Typing indicators
- User presence status
- Unread message counts
- Message history with pagination
- Separate user types (recruiters and applicants)

## Directory Structure

```
messages/
├── models/              # MongoDB document schemas
├── routes/              # API endpoints
├── services/            # Business logic
├── utils/               # Utility functions and WebSocket manager
├── main.py              # FastAPI application
├── schemas.py           # Pydantic schemas
└── README.md            # This file
```

## Setup & Running

1. Make sure all dependencies are installed:
   ```
   poetry install
   ```

2. Configure MongoDB:
   The system uses the DB_Connectors module to connect to your MongoDB database.
   Make sure your connection details are properly set in DB_Connectors/config.yaml.

3. Start the messaging service:
   ```
   python run_messaging.py
   ```

4. The API will be available at `http://localhost:8000/`
   - API documentation at `http://localhost:8000/docs`
   - Alternative documentation at `http://localhost:8000/redoc`

## API Endpoints

- **Conversations**
  - `POST /api/conversations/` - Create a new conversation
  - `GET /api/conversations/{conversation_id}` - Get conversation details
  - `GET /api/conversations/{conversation_id}/messages` - Get messages in a conversation
  - `PUT /api/conversations/{conversation_id}/read` - Mark all messages as read

- **Messages**
  - `POST /api/messages/` - Send a message
  - `GET /api/messages/{message_id}` - Get message details
  - `PUT /api/messages/{message_id}/read` - Mark a message as read

- **Users**
  - `GET /api/users/{user_id}/conversations` - Get all conversations for a user
  - `GET /api/users/{user_id}/unread` - Get unread message counts

- **WebSockets**
  - `WebSocket /api/ws/{user_id}` - WebSocket connection for real-time updates

## Testing

Run the tests with pytest:

```
python -m pytest tests/messages
```

## Usage Examples

### Creating a Conversation

```python
import requests

response = requests.post(
    "http://localhost:8000/api/conversations/",
    json={
        "title": "Job Interview",
        "participant_ids": [1, 2],
        "participant_types": ["recruiter", "applicant"]
    }
)
conversation = response.json()
conversation_id = conversation["id"]
```

### Sending a Message

```python
import requests

response = requests.post(
    "http://localhost:8000/api/messages/",
    json={
        "content": "Hello! Are you available for an interview next week?",
        "sender_id": 1,
        "sender_type": "recruiter",
        "conversation_id": "65f3a1b2e4b06b5a8c9d7e0f"  # MongoDB ObjectId as string
    }
)
message = response.json()
```

### Getting Messages from a Conversation

```python
import requests

response = requests.get(
    "http://localhost:8000/api/conversations/65f3a1b2e4b06b5a8c9d7e0f/messages"
)
messages = response.json()
```

### Connecting to WebSocket for Real-time Updates

```python
import websockets
import asyncio
import json

async def connect():
    uri = "ws://localhost:8000/api/ws/2"  # Connect as user 2
    async with websockets.connect(uri) as websocket:
        # Send typing status
        await websocket.send(json.dumps({
            "type": "typing_status",
            "conversation_id": "65f3a1b2e4b06b5a8c9d7e0f",
            "is_typing": True
        }))
        
        # Listen for messages
        while True:
            message = await websocket.recv()
            data = json.loads(message)
            print(f"Received: {data}")

asyncio.run(connect())
```

## Integration with Frontend

To integrate with the React frontend, use the WebSocket hook and API services provided in the frontend codebase. When making API calls, remember that MongoDB uses string IDs (converted from ObjectIds) instead of integer IDs. 