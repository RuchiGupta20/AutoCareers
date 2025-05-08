import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import ConversationList from './ConversationList';
import ConversationView from './ConversationView';
import { User, Message } from '../../types/message';
import * as messageService from '../../services/messageService';

interface MessageBoardProps {
  currentUser: {
    id: number;
    name: string;
    type: 'recruiter' | 'applicant';
  };
}

const MessageBoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 80px)', // Account for navbar and padding
  backgroundColor: '#fff',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  position: 'sticky',
  top: '80px', // Stick right below the navbar
  overflow: 'hidden', // Prevent scrollbars on the container itself
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
  {
    id: 3,
    name: 'Jane Smith',
    title: 'Applicant',
    type: 'applicant',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
  },
  {
    id: 4,
    name: 'Current User',
    title: 'Developer',
    type: 'applicant',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg'
  }
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

// Jan Mayer conversation messages
const JAN_MESSAGES: Message[] = [
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

// John Doe conversation messages
const JOHN_MESSAGES: Message[] = [
  {
    id: '4',
    content: 'Hello! I noticed your profile and thought you would be a great fit for a position we have at TechCorp.',
    senderId: 2,
    senderType: 'recruiter',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    read: true,
  },
  {
    id: '5',
    content: 'The role is for a Senior Frontend Developer with React expertise. Would you be interested in discussing this opportunity?',
    senderId: 2,
    senderType: 'recruiter',
    timestamp: new Date(Date.now() - 115 * 60000).toISOString(),
    read: true,
  },
  {
    id: '6',
    content: "Hi John, I'd definitely be interested in learning more about the position. Could you share more details about the responsibilities and requirements?",
    senderId: 4,
    senderType: 'applicant',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    read: true,
  },
  {
    id: '7',
    content: 'Great! The role involves leading our frontend team, architecting new features, and mentoring junior developers. We use React, TypeScript, and Material UI. When would be a good time for a call?',
    senderId: 2,
    senderType: 'recruiter',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    read: true,
  },
];

const MessageBoard: React.FC<MessageBoardProps> = ({ currentUser }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>([]);

  // Set default messages based on the selected conversation
  useEffect(() => {
    if (selectedConversationId === '1') {
      setMessages(JAN_MESSAGES);
    } else if (selectedConversationId === '2') {
      setMessages(JOHN_MESSAGES);
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
        participants: selectedConversationId === '1' 
          ? [
              SAMPLE_USERS[0], // Jan Mayer
              {
                id: currentUser.id,
                name: currentUser.name,
                type: currentUser.type,
                avatar: SAMPLE_USERS[3].avatar, // Using sample avatar
              }
            ]
          : [
              SAMPLE_USERS[1], // John Doe
              {
                id: currentUser.id,
                name: currentUser.name,
                type: currentUser.type,
                avatar: SAMPLE_USERS[3].avatar, // Using sample avatar
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