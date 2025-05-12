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
  height: '100%',
  overflow: 'hidden',
}));

const ConversationHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
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

  // Find the other participant (not the current user)
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);

  return (
    <ConversationViewContainer>
      {otherParticipant && (
        <ConversationHeader>
          <Typography variant="h6">
            {otherParticipant.name}
          </Typography>
          {otherParticipant.title && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {otherParticipant.title} {otherParticipant.company ? `at ${otherParticipant.company}` : ''}
            </Typography>
          )}
        </ConversationHeader>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', overflow: 'hidden' }}>
        <MessageList
          messages={conversation.messages}
          participants={conversation.participants}
          currentUserId={currentUserId}
        />
        <MessageInput onSendMessage={onSendMessage} />
      </Box>
    </ConversationViewContainer>
  );
};

export default ConversationView; 