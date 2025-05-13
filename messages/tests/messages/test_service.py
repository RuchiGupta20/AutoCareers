import pytest
import mongomock
from bson import ObjectId
from fastapi import HTTPException

from messages.models.models import User, Conversation, Message
from messages.services.message_service import message_service
from messages.schemas import MessageCreate, ConversationCreate

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

def test_create_conversation(mock_mongodb):
    """Test creating a new conversation"""
    # Create conversation with recruiter and applicant
    conversation_data = ConversationCreate(
        title="Job Interview",
        participant_ids=[1, 2],
        participant_types=["recruiter", "applicant"]
    )
    
    conversation = message_service.create_conversation(conversation_data)
    
    # Verify the conversation was created correctly
    conversations_coll = mock_mongodb["conversations"]
    db_conversation = conversations_coll.find_one({"_id": conversation["_id"]})
    
    assert db_conversation is not None
    assert db_conversation["title"] == "Job Interview"
    
    # Check participants
    assert len(db_conversation["participants"]) == 2
    participant_ids = [p["user_id"] for p in db_conversation["participants"]]
    assert 1 in participant_ids
    assert 2 in participant_ids

def test_create_message(mock_mongodb):
    """Test creating a new message in a conversation"""
    # First create a conversation
    conversation_data = ConversationCreate(
        title="Technical Discussion",
        participant_ids=[1, 2],
        participant_types=["recruiter", "applicant"]
    )
    conversation = message_service.create_conversation(conversation_data)
    
    # Create a message from recruiter to applicant
    message_data = MessageCreate(
        content="Are you available for an interview next week?",
        sender_id=1,
        sender_type="recruiter",
        conversation_id=str(conversation["_id"])
    )
    
    message = message_service.create_message(message_data)
    
    # Verify the message was created correctly
    messages_coll = mock_mongodb["messages"]
    db_message = messages_coll.find_one({"_id": message["_id"]})
    
    assert db_message is not None
    assert db_message["content"] == "Are you available for an interview next week?"
    assert db_message["sender_id"] == 1
    assert db_message["sender_type"] == "recruiter"
    assert db_message["conversation_id"] == str(conversation["_id"])
    assert db_message["read_status"] == False

def test_get_conversation_messages(mock_mongodb):
    """Test retrieving messages from a conversation"""
    # Create conversation
    conversation_data = ConversationCreate(
        title="Interview Process",
        participant_ids=[1, 2],
        participant_types=["recruiter", "applicant"]
    )
    conversation = message_service.create_conversation(conversation_data)
    conversation_id = str(conversation["_id"])
    
    # Create multiple messages
    messages = [
        MessageCreate(
            content="Hi, we'd like to interview you for the position",
            sender_id=1,
            sender_type="recruiter",
            conversation_id=conversation_id
        ),
        MessageCreate(
            content="I'd be happy to schedule an interview",
            sender_id=2,
            sender_type="applicant",
            conversation_id=conversation_id
        ),
        MessageCreate(
            content="Great! How about next Tuesday at 2pm?",
            sender_id=1,
            sender_type="recruiter",
            conversation_id=conversation_id
        )
    ]
    
    for message_data in messages:
        message_service.create_message(message_data)
    
    # Retrieve messages
    retrieved_messages = message_service.get_conversation_messages(conversation_id)
    
    assert len(retrieved_messages) == 3
    assert retrieved_messages[0]["content"] == "Hi, we'd like to interview you for the position"
    assert retrieved_messages[1]["content"] == "I'd be happy to schedule an interview"
    assert retrieved_messages[2]["content"] == "Great! How about next Tuesday at 2pm?"

def test_mark_message_as_read(mock_mongodb):
    """Test marking a message as read"""
    # Create conversation
    conversation_data = ConversationCreate(
        title="Follow-up",
        participant_ids=[1, 2],
        participant_types=["recruiter", "applicant"]
    )
    conversation = message_service.create_conversation(conversation_data)
    
    # Create a message
    message_data = MessageCreate(
        content="Please submit your portfolio",
        sender_id=1,
        sender_type="recruiter",
        conversation_id=str(conversation["_id"])
    )
    message = message_service.create_message(message_data)
    
    # Verify it's unread
    assert message["read_status"] == False
    
    # Mark as read
    success = message_service.mark_message_as_read(str(message["_id"]))
    
    # Verify it worked
    assert success == True
    updated_message = message_service.get_message(str(message["_id"]))
    assert updated_message["read_status"] == True

def test_get_user_conversations(mock_mongodb):
    """Test getting all conversations for a user"""
    # Create multiple conversations for the same user
    conversation_data1 = ConversationCreate(
        title="Job A Discussion",
        participant_ids=[1, 2],
        participant_types=["recruiter", "applicant"]
    )
    conversation_data2 = ConversationCreate(
        title="Job B Discussion",
        participant_ids=[1, 2],
        participant_types=["recruiter", "applicant"]
    )
    
    conversation1 = message_service.create_conversation(conversation_data1)
    conversation2 = message_service.create_conversation(conversation_data2)
    
    # Get conversations for recruiter
    recruiter_conversations = message_service.get_user_conversations(1)
    
    assert len(recruiter_conversations) >= 2
    conversation_titles = [c["title"] for c in recruiter_conversations]
    assert "Job A Discussion" in conversation_titles
    assert "Job B Discussion" in conversation_titles
    
    # Get conversations for applicant
    applicant_conversations = message_service.get_user_conversations(2)
    
    assert len(applicant_conversations) >= 2 