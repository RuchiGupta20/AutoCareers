import pytest
import json
import asyncio
from fastapi.testclient import TestClient
try:
    import websockets.client
except ImportError:
    pass  # We'll skip tests that require this if it's not available

from messages.main import app

@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client

# This test doesn't require an actual connection since TestClient handles it
def test_websocket_route_exists(client):
    """Test that the WebSocket route exists"""
    with client.websocket_connect("/api/ws/1") as ws:
        # Just test that we can connect
        pass

# This is a unit test for the WebSocket manager functionality
def test_websocket_message_broadcast(client):
    """Test WebSocket message broadcast functionality"""
    from messages.utils.websocket_manager import manager
    
    # Create a test message
    test_message = {
        "type": "test",
        "content": "Hello, this is a test message"
    }
    
    # Test the broadcast method directly
    # This doesn't actually send messages but verifies the method exists
    # In a real environment, you would use actual WebSocket connections
    manager.active_connections = {}  # Reset connections
    
    # The method should run without errors even if no connections exist
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(
            manager.broadcast_to_conversation(test_message, "test-conversation-id")
        )
    except Exception as e:
        pytest.fail(f"WebSocket manager failed: {e}")
    finally:
        loop.close()

def test_websocket_manager_methods():
    """Test WebSocket manager has required methods"""
    from messages.utils.websocket_manager import manager
    
    # Verify the WebSocket manager has all required methods
    assert hasattr(manager, "connect")
    assert hasattr(manager, "disconnect")
    assert hasattr(manager, "send_personal_message")
    assert hasattr(manager, "broadcast_to_conversation")
    assert hasattr(manager, "set_typing_status")
    assert hasattr(manager, "set_active_conversation")
    
    # Verify the manager has the required data structures
    assert hasattr(manager, "active_connections")
    assert hasattr(manager, "user_active_conversations")
    assert hasattr(manager, "typing_status") 