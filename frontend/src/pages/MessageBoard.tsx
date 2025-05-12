import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import ConversationList from '../components/ConversationList';
import ConversationView from '../components/ConversationView';
import { User, Message } from '../types/message';
import * as messageService from '../services/messageService';

interface MessageBoardProps {
  currentUser: {
    id: number;
    name: string;
    type: 'recruiter' | 'applicant';
  };
}

const MessageBoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 64px)', // Adjust based on your nav height
  backgroundColor: '#fff',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

// Sample data (would normally come from the API)
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
];

const SAMPLE_CONVERSATIONS = [
  {
    id: '1',
    user: SAMPLE_USERS[0],
  },
  {
    id: '2',
    user: SAMPLE_USERS[1],
  },
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Hey Jake, I wanted to reach out because we saw your work contributions and were impressed by your work.',
    senderId: 1,
    senderType: 'recruiter',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    read: true,
  },
  {
    id: '2',
    content: 'We want to invite you for a quick interview',
    senderId: 1,
    senderType: 'recruiter',
    timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
    read: true,
  },
  {
    id: '3',
    content: 'Hi Jan, sure I would love to. Thanks for taking the time to see my work!',
    senderId: 4,
    senderType: 'applicant',
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    read: true,
  },
];

const MessageBoard: React.FC<MessageBoardProps> = ({ currentUser }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);

  // Would normally fetch conversations from API
  useEffect(() => {
    // In a real app, this would be:
    // messageService.getConversations(currentUser.id)
    //   .then(data => setConversations(data))
  }, [currentUser.id]);

  // Would normally fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      // In a real app, this would be:
      // messageService.getConversationMessages(selectedConversationId)
      //   .then(data => setMessages(data))
    }
  }, [selectedConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: currentUser.id,
      senderType: currentUser.type,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);

    // In a real app, this would be:
    // messageService.sendMessage(
    //   content,
    //   currentUser.id,
    //   currentUser.type,
    //   selectedConversationId
    // )
  };

  // Get active conversation with all needed data
  const activeConversation = selectedConversationId
    ? {
        id: selectedConversationId,
        title: 'Conversation',
        messages: messages,
        participants: [
          selectedConversationId === '1' ? SAMPLE_USERS[0] : SAMPLE_USERS[1],
          {
            id: currentUser.id,
            name: currentUser.name,
            type: currentUser.type,
            avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
          }
        ],
        startedAt: new Date(Date.now() - 60 * 60000).toISOString(),
      }
    : null;

  return (
    <MessageBoardContainer>
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