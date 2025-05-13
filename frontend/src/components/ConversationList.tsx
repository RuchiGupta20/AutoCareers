import React from 'react';
import { Box, List, Typography, styled } from '@mui/material';
import ConversationItem from './ConversationItem';
import { User } from '../types/message';

/**
 * Represents a conversation in the list view
 */
interface Conversation {
  /** Unique identifier for the conversation */
  id: string;
  /** The other user in the conversation */
  user: User;
}

/**
 * Props for the ConversationList component
 */
interface ConversationListProps {
  /** Array of conversations to display */
  conversations: Conversation[];
  /** ID of the currently selected conversation, if any */
  selectedConversationId: string | null;
  /** Callback for when a conversation is selected */
  onSelectConversation: (conversationId: string) => void;
}

/**
 * Styled container for the conversation list sidebar
 */
const ConversationListContainer = styled(Box)(({ theme }) => ({
  width: 320,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
}));

/**
 * Styled header for the conversation list
 */
const ConversationListHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/**
 * Styled scrollable content area for the conversations
 */
const ConversationListContent = styled(List)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: 0,
}));

/**
 * ConversationList Component
 * 
 * Displays a list of conversations in a sidebar.
 * Each conversation shows the other participant's information.
 * 
 * @param props - Component props
 * @returns React component
 */
const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  return (
    <ConversationListContainer>
      <ConversationListHeader>
        <Typography variant="h6">Messages</Typography>
      </ConversationListHeader>
      <ConversationListContent>
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            user={conversation.user}
            isSelected={conversation.id === selectedConversationId}
            onClick={() => onSelectConversation(conversation.id)}
          />
        ))}
      </ConversationListContent>
    </ConversationListContainer>
  );
};

export default ConversationList; 