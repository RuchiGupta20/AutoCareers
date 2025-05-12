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
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
};

export default MessageList; 