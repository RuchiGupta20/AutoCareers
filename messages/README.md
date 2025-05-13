# AutoCareers Messaging System

A messaging platform that enables communication between recruiters and applicants, built with FastAPI and MongoDB.

## Features

- MongoDB-based database for scalable data storage
- Conversation management
- Message read status tracking
- Separate user types (recruiters and applicants)
- Message history with pagination
- Unread message counts

## Setup & Running

1. Make sure MongoDB is running. For local development, you can use:
   ```
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. Set up the database connection in `DB_Connectors/config.yaml`.

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

## Integration

This messaging system integrates with the existing AutoCareers application by:

1. Using the existing MongoDB database connection from `DB_Connectors`
2. Following the same API patterns as other services
3. Using the same user ID system for consistency 