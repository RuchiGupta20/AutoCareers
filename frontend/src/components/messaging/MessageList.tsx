import React, { useEffect, useRef } from 'react';
import { Box, Typography, Divider, styled } from '@mui/material';
import MessageItem from './MessageItem';
import { Message, User } from '../../types/message';

interface MessageListProps {
  messages: Message[];
  participants: User[];
  currentUserId: number;
  conversationStarted: string;
}

const MessageListContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  padding: '20px 0',
}));

const StartDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  margin: '20px 0',
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid #e0e0e0`,
  },
  '&::before': {
    marginRight: '16px',
  },
  '&::after': {
    marginLeft: '16px',
  },
}));

const MessageList: React.FC<MessageListProps> = ({
  messages,
  participants,
  currentUserId,
  conversationStarted,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Find the other participant (not the current user)
  const otherParticipant = participants.find(p => p.id !== currentUserId);

  if (!otherParticipant) {
    return <Typography>Conversation not found</Typography>;
  }

  return (
    <MessageListContainer>
      <StartDivider>
        <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
          This is the very beginning of your direct message with {otherParticipant.name}
        </Typography>
      </StartDivider>

      {messages.map((message) => {
        const sender = participants.find(p => p.id === message.senderId) || otherParticipant;
        const isCurrentUser = message.senderId === currentUserId;
        
        return (
          <MessageItem
            key={message.id}
            message={message}
            sender={sender}
            isCurrentUser={isCurrentUser}
          />
        );
      })}
      
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
};

export default MessageList; 