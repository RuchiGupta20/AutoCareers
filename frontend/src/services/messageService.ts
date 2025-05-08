import { Conversation, Message, User } from '../types/message';
import io, { Socket } from 'socket.io-client';

const API_URL = 'http://localhost:8000/api';
let socket: Socket | null = null;

export const connectWebSocket = (userId: number, onMessageReceived: (message: any) => void) => {
  // Close any existing connection
  if (socket) {
    socket.close();
  }

  // Connect to WebSocket
  socket = io(`${API_URL}/ws/${userId}`, {
    transports: ['websocket'],
    upgrade: false,
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('message', (data) => {
    console.log('Message received:', data);
    onMessageReceived(data);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket');
  });

  return () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };
};

export const sendTypingStatus = (
  conversationId: string, 
  isTyping: boolean
) => {
  if (socket) {
    socket.emit('typing_status', {
      type: 'typing_status',
      conversation_id: conversationId,
      is_typing: isTyping
    });
  }
};

export const getConversations = async (userId: number): Promise<Conversation[]> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/conversations`);
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

export const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const sendMessage = async (
  content: string,
  senderId: number,
  senderType: 'recruiter' | 'applicant',
  conversationId: string
): Promise<Message | null> => {
  try {
    const response = await fetch(`${API_URL}/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        sender_id: senderId,
        sender_type: senderType,
        conversation_id: conversationId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/messages/${messageId}/read`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
};

export const createConversation = async (
  title: string,
  participantIds: number[],
  participantTypes: ('recruiter' | 'applicant')[]
): Promise<Conversation | null> => {
  try {
    const response = await fetch(`${API_URL}/conversations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        participant_ids: participantIds,
        participant_types: participantTypes,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
}; 