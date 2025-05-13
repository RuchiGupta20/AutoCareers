import React, { useRef, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import MessageItem from './MessageItem';
import { Message, User } from '../types/message';

interface MessageListProps {
  messages: Message[];
  participants: User[];
  currentUserId: number;
}

const MessageListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MessagesGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

const MessageList: React.FC<MessageListProps> = ({ messages, participants, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <MessageListContainer>
      <MessagesGroup>
        {messages.map((message) => {
          const sender = participants.find((p) => p.id === message.senderId);
          if (!sender) return null;
          
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
      </MessagesGroup>
      <div ref={messagesEndRef} style={{ height: '12px' }} />
    </MessageListContainer>
  );
};

export default MessageList; 