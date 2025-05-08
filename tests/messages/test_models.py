import pytest
import mongomock
import sys
from datetime import datetime
from bson import ObjectId

# Mock MongoDB for testing
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

def test_create_user(mock_mongodb):
    """Test creating a user with MongoDB model"""
    from messages.models.models import User
    
    # Create a user document
    user_data = User.create(
        user_id=1,
        username="testuser",
        email="test@example.com",
        user_type="applicant"
    )
    
    # Insert into mock collection
    users_collection = mock_mongodb["users"]
    result = users_collection.insert_one(user_data)
    
    # Retrieve and verify
    retrieved_user = users_collection.find_one({"username": "testuser"})
    assert retrieved_user is not None
    assert retrieved_user["email"] == "test@example.com"
    assert retrieved_user["user_type"] == "applicant"
    assert retrieved_user["user_id"] == 1

def test_create_conversation(mock_mongodb):
    """Test creating a conversation with MongoDB model"""
    from messages.models.models import User, Conversation
    
    # Create users and insert
    users_collection = mock_mongodb["users"]
    
    recruiter_data = User.create(
        user_id=1,
        username="recruiter1",
        email="recruiter@example.com",
        user_type="recruiter"
    )
    
    applicant_data = User.create(
        user_id=2,
        username="applicant1",
        email="applicant@example.com",
        user_type="applicant"
    )
    
    users_collection.insert_many([recruiter_data, applicant_data])
    
    # Create conversation with participants
    conversations_collection = mock_mongodb["conversations"]
    
    conversation_data = Conversation.create(
        title="Interview discussion",
        participants=[
            {"user_id": 1, "user_type": "recruiter"},
            {"user_id": 2, "user_type": "applicant"}
        ]
    )
    
    result = conversations_collection.insert_one(conversation_data)
    conversation_id = result.inserted_id
    
    # Retrieve and verify
    retrieved_conversation = conversations_collection.find_one({"_id": conversation_id})
    assert retrieved_conversation is not None
    assert retrieved_conversation["title"] == "Interview discussion"
    assert len(retrieved_conversation["participants"]) == 2
    assert retrieved_conversation["participants"][0]["user_id"] == 1
    assert retrieved_conversation["participants"][1]["user_id"] == 2

def test_create_message(mock_mongodb):
    """Test creating a message with MongoDB model"""
    from messages.models.models import User, Conversation, Message
    
    # Create users and insert
    users_collection = mock_mongodb["users"]
    
    recruiter_data = User.create(
        user_id=1,
        username="recruiter2",
        email="recruiter2@example.com",
        user_type="recruiter"
    )
    
    applicant_data = User.create(
        user_id=2,
        username="applicant2",
        email="applicant2@example.com",
        user_type="applicant"
    )
    
    users_collection.insert_many([recruiter_data, applicant_data])
    
    # Create conversation with participants
    conversations_collection = mock_mongodb["conversations"]
    
    conversation_data = Conversation.create(
        title="Technical interview",
        participants=[
            {"user_id": 1, "user_type": "recruiter"},
            {"user_id": 2, "user_type": "applicant"}
        ]
    )
    
    result = conversations_collection.insert_one(conversation_data)
    conversation_id = result.inserted_id
    
    # Create message
    messages_collection = mock_mongodb["messages"]
    
    message_data = Message.create(
        conversation_id=str(conversation_id),
        sender_id=1,
        sender_type="recruiter",
        content="Hello, when are you available for an interview?"
    )
    
    result = messages_collection.insert_one(message_data)
    message_id = result.inserted_id
    
    # Retrieve and verify
    retrieved_message = messages_collection.find_one({"_id": message_id})
    assert retrieved_message is not None
    assert retrieved_message["content"] == "Hello, when are you available for an interview?"
    assert retrieved_message["sender_id"] == 1
    assert retrieved_message["sender_type"] == "recruiter"
    assert retrieved_message["read_status"] == False
    assert retrieved_message["conversation_id"] == str(conversation_id) 