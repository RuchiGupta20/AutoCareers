import React from 'react';
import { Box, List, Typography, styled } from '@mui/material';
import ConversationItem from './ConversationItem';
import { User } from '../types/message';

interface Conversation {
  id: string;
  user: User;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationListContainer = styled(Box)(({ theme }) => ({
  width: 320,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
}));

const ConversationListHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ConversationListContent = styled(List)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: 0,
}));

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