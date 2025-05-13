import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import ConversationList from '../components/ConversationList';
import ConversationView from '../components/ConversationView';
import { User, Message } from '../types/message';
import * as messageService from '../services/messageService';

/**
 * Props for the MessageBoard component
 */
interface MessageBoardProps {
  /** The current user viewing the message board */
  currentUser: {
    /** User's unique identifier */
    id: number;
    /** User's display name */
    name: string;
    /** User's role type */
    type: 'recruiter' | 'applicant';
  };
}

/**
 * Styled container for the message board layout
 */
const MessageBoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 64px)', // Adjust based on your nav height
  backgroundColor: '#fff',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

// Sample users for demo purposes
const SAMPLE_USERS: User[] = [
  {
    id: 1,
    name: 'Jan Mayer',
    title: 'Recruiter',
    company: 'Nomad',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    name: 'John Doe',
    title: 'Recruiter',
    company: 'TechCorp',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
  },
  {
    id: 3,
    name: 'Sarah Smith',
    title: 'Recruiter',
    company: 'Innovate Inc',
    type: 'recruiter',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
];

/**
 * MessageBoard Component for Applicant View
 * 
 * Displays a list of conversations on the left side and the selected conversation on the right.
 * Handles fetching, displaying, and sending messages for applicant users.
 * 
 * @param props - Component props
 * @returns React component
 */
const MessageBoard: React.FC<MessageBoardProps> = ({ currentUser }) => {
  // Selected conversation state
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  // Conversations list state
  const [conversations, setConversations] = useState<{id: string, user: User}[]>([]);
  // Messages in the current conversation
  const [messages, setMessages] = useState<Message[]>([]);
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Fetch user conversations when component mounts
   * Sets up auto-refresh every 15 seconds
   */
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const data = await messageService.getConversations(currentUser.id);
        
        // Format conversations for the UI
        const formattedConversations = data.map(conv => {
          // Find the other participant (not the current user)
          const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
          return {
            id: conv.id,
            user: otherParticipant || { 
              id: 0, 
              name: "Unknown User", 
              type: "recruiter" as const, 
              avatar: "" 
            }
          };
        });
        
        setConversations(formattedConversations);
        
        // Auto-select the first conversation if none is selected
        if (!selectedConversationId && formattedConversations.length > 0) {
          setSelectedConversationId(formattedConversations[0].id);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Periodically refresh conversations
    const intervalId = setInterval(fetchConversations, 15000);
    
    return () => clearInterval(intervalId);
  }, [currentUser.id, selectedConversationId]);

  /**
   * Fetch messages for the selected conversation
   * Sets up auto-refresh every 5 seconds
   */
  useEffect(() => {
    if (!selectedConversationId) return;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const data = await messageService.getConversationMessages(selectedConversationId);
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Periodically refresh messages for the selected conversation
    const intervalId = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [selectedConversationId]);

  /**
   * Handle conversation selection
   * 
   * @param conversationId - ID of the conversation to select
   */
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  /**
   * Send a new message in the current conversation
   * 
   * @param content - Text content of the message to send
   */
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;

    try {
      const response = await messageService.sendMessage(
        content,
        currentUser.id,
        currentUser.type,
        selectedConversationId
      );
      
      if (response) {
        // Immediately update the UI with the new message
        setMessages(prevMessages => {
          if (!prevMessages.some(msg => msg.id === response.id)) {
            return [...prevMessages, response];
          }
          return prevMessages;
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  /**
   * Get participants for the active conversation
   * 
   * @returns Array of users in the active conversation
   */
  const getActiveConversationParticipants = () => {
    if (!selectedConversationId) return [];
    
    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return [];
    
    return [
      conversation.user,
      {
        id: currentUser.id,
        name: currentUser.name,
        type: currentUser.type,
        avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
      }
    ];
  };

  // Get active conversation with all needed data
  const activeConversation = selectedConversationId
    ? {
        id: selectedConversationId,
        title: 'Conversation',
        messages: messages,
        participants: getActiveConversationParticipants(),
        startedAt: new Date(Date.now() - 60 * 60000).toISOString(),
      }
    : null;

  return (
    <MessageBoardContainer>
      {isLoading && !conversations.length && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Typography>Loading conversations...</Typography>
        </Box>
      )}
      
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
      />
      <ConversationView
        conversation={activeConversation}
        currentUserId={currentUser.id}
        onSendMessage={handleSendMessage}
      />
    </MessageBoardContainer>
  );
};

export default MessageBoard; 