import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message, User } from '../types/message';

/**
 * Represents a conversation with its details for display
 */
interface Conversation {
  /** Unique identifier for the conversation */
  id: string;
  /** Title of the conversation */
  title: string;
  /** List of messages in the conversation */
  messages: Message[];
  /** Users participating in the conversation */
  participants: User[];
  /** ISO timestamp when the conversation started */
  startedAt: string;
}

/**
 * Props for the ConversationView component
 */
interface ConversationViewProps {
  /** The conversation to display, or null if none selected */
  conversation: Conversation | null;
  /** ID of the current user viewing the conversation */
  currentUserId: number;
  /** Callback for when a message is sent */
  onSendMessage: (content: string) => void;
}

/**
 * Styled container for the conversation view
 */
const ConversationViewContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  height: '100%',
  overflow: 'hidden',
}));

/**
 * Styled header for the conversation view
 * Shows information about the other participant
 */
const ConversationHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
}));

/**
 * Styled container for the empty state when no conversation is selected
 */
const EmptyStateContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

/**
 * ConversationView Component
 * 
 * Displays the selected conversation with message history and a message input.
 * Shows the conversation header with information about the other participant.
 * Displays an empty state when no conversation is selected.
 * 
 * @param props - Component props
 * @returns React component
 */
const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  currentUserId,
  onSendMessage,
}) => {
  // Show empty state if no conversation is selected
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