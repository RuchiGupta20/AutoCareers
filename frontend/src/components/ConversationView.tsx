import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message, User } from '../types/message';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  participants: User[];
  startedAt: string;
}

interface ConversationViewProps {
  conversation: Conversation | null;
  currentUserId: number;
  onSendMessage: (content: string) => void;
}

const ConversationViewContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  currentUserId,
  onSendMessage,
}) => {
  if (!conversation) {
    return (
      <EmptyStateContainer>
        <Typography variant="h6" color="text.secondary">
          Select a conversation to start messaging
        </Typography>
      </EmptyStateContainer>
    );
  }

  return (
    <ConversationViewContainer>
      <MessageList
        messages={conversation.messages}
        participants={conversation.participants}
        currentUserId={currentUserId}
      />
      <MessageInput onSendMessage={onSendMessage} />
    </ConversationViewContainer>
  );
};

export default ConversationView; 