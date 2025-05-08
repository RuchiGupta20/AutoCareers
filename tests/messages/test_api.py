import pytest
import mongomock
from fastapi.testclient import TestClient
from bson import ObjectId

from messages.models.models import User, Conversation
from messages.main import app

# Setup mock MongoDB for testing
@pytest.fixture
def mock_mongodb():
    """Create a mock MongoDB client for testing"""
    # Create a mock MongoDB client
    client = mongomock.MongoClient()
    db = client["test_database"]
    
    # Create collections
    messages_collection = db["messages"]
    conversations_collection = db["conversations"]
    users_collection = db["users"]
    
    # Create test users
    recruiter_data = User.create(
        user_id=1,
        username="recruiter",
        email="recruiter@example.com",
        user_type="recruiter"
    )
    
    applicant_data = User.create(
        user_id=2,
        username="applicant",
        email="applicant@example.com",
        user_type="applicant"
    )
    
    users_collection.insert_many([recruiter_data, applicant_data])
    
    # Patch the database functions to use mock
    import messages.models.database as db_module
    
    # Save original functions
    original_get_db = db_module.get_db
    original_get_messages = db_module.get_messages_collection
    original_get_conversations = db_module.get_conversations_collection
    original_get_users = db_module.get_users_collection
    
    # Replace with mock
    db_module.get_db = lambda: db
    db_module.get_messages_collection = lambda: messages_collection
    db_module.get_conversations_collection = lambda: conversations_collection
    db_module.get_users_collection = lambda: users_collection
    
    yield {
        "db": db,
        "messages": messages_collection,
        "conversations": conversations_collection,
        "users": users_collection
    }
    
    # Restore original functions
    db_module.get_db = original_get_db
    db_module.get_messages_collection = original_get_messages
    db_module.get_conversations_collection = original_get_conversations
    db_module.get_users_collection = original_get_users

@pytest.fixture
def client(mock_mongodb):
    with TestClient(app) as client:
        yield client

def test_create_conversation(client):
    """Test creating a conversation via API"""
    response = client.post(
        "/api/conversations/",
        json={
            "title": "Job Interview",
            "participant_ids": [1, 2],
            "participant_types": ["recruiter", "applicant"]
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Job Interview"
    assert "id" in data
    assert "created_at" in data

def test_send_message(client):
    """Test sending a message via API"""
    # First create a conversation
    conversation_response = client.post(
        "/api/conversations/",
        json={
            "title": "Technical Discussion",
            "participant_ids": [1, 2],
            "participant_types": ["recruiter", "applicant"]
        }
    )
    
    conversation_id = conversation_response.json()["id"]
    
    # Send a message
    message_response = client.post(
        "/api/messages/",
        json={
            "content": "Hi, I'm interested in scheduling an interview",
            "sender_id": 2,
            "sender_type": "applicant",
            "conversation_id": conversation_id
        }
    )
    
    assert message_response.status_code == 200
    data = message_response.json()
    assert data["content"] == "Hi, I'm interested in scheduling an interview"
    assert data["sender_id"] == 2
    assert data["sender_type"] == "applicant"
    assert data["conversation_id"] == conversation_id
    assert data["read_status"] == False

def test_get_conversation_messages(client):
    """Test retrieving messages from a conversation via API"""
    # Create conversation
    conversation_response = client.post(
        "/api/conversations/",
        json={
            "title": "Application Status",
            "participant_ids": [1, 2],
            "participant_types": ["recruiter", "applicant"]
        }
    )
    
    conversation_id = conversation_response.json()["id"]
    
    # Send messages
    client.post(
        "/api/messages/",
        json={
            "content": "What's the status of my application?",
            "sender_id": 2,
            "sender_type": "applicant",
            "conversation_id": conversation_id
        }
    )
    
    client.post(
        "/api/messages/",
        json={
            "content": "We're still reviewing applications, will get back to you soon",
            "sender_id": 1,
            "sender_type": "recruiter",
            "conversation_id": conversation_id
        }
    )
    
    # Get messages
    response = client.get(f"/api/conversations/{conversation_id}/messages")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["content"] == "What's the status of my application?"
    assert data[1]["content"] == "We're still reviewing applications, will get back to you soon"

def test_mark_message_as_read(client):
    """Test marking a message as read via API"""
    # Create conversation
    conversation_response = client.post(
        "/api/conversations/",
        json={
            "title": "Final Interview",
            "participant_ids": [1, 2],
            "participant_types": ["recruiter", "applicant"]
        }
    )
    
    conversation_id = conversation_response.json()["id"]
    
    # Send a message
    message_response = client.post(
        "/api/messages/",
        json={
            "content": "Congratulations! You've been selected for the final interview.",
            "sender_id": 1,
            "sender_type": "recruiter",
            "conversation_id": conversation_id
        }
    )
    
    message_id = message_response.json()["id"]
    
    # Mark as read
    read_response = client.put(f"/api/messages/{message_id}/read")
    
    assert read_response.status_code == 200
    assert read_response.json()["success"] == True
    
    # Verify it's marked as read
    conversation_response = client.get(f"/api/conversations/{conversation_id}/messages")
    messages = conversation_response.json()
    
    assert messages[0]["read_status"] == True

def test_get_user_conversations(client):
    """Test getting all conversations for a user via API"""
    # Create multiple conversations
    client.post(
        "/api/conversations/",
        json={
            "title": "Job A Interview",
            "participant_ids": [1, 2],
            "participant_types": ["recruiter", "applicant"]
        }
    )
    
    client.post(
        "/api/conversations/",
        json={
            "title": "Job B Interview",
            "participant_ids": [1, 2],
            "participant_types": ["recruiter", "applicant"]
        }
    )
    
    # Get conversations for user 1 (recruiter)
    response = client.get("/api/users/1/conversations")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    
    titles = [c["title"] for c in data]
    assert "Job A Interview" in titles
    assert "Job B Interview" in titles 