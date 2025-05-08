import React from 'react';
import { Box, Typography, IconButton, Avatar, Divider, styled } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Conversation, Message, User } from '../../types/message';

interface ConversationViewProps {
  conversation: {
    id: string;
    title: string;
    messages: Message[];
    participants: User[];
    startedAt: string;
  } | null;
  currentUserId: number;
  onSendMessage: (content: string) => void;
}

const ConversationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  borderBottom: '1px solid #eaeaea',
}));

const HeaderProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const ConversationViewContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '20px',
  textAlign: 'center',
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

  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);

  if (!otherParticipant) {
    return <Typography>Conversation not found</Typography>;
  }

  return (
    <ConversationViewContainer>
      <ConversationHeader>
        <HeaderProfile>
          <Avatar
            src={otherParticipant.avatar}
            alt={otherParticipant.name}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {otherParticipant.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {otherParticipant.title} at {otherParticipant.company}
            </Typography>
          </Box>
        </HeaderProfile>
        <Box>
          <IconButton size="small">
            <StarBorderIcon />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
      </ConversationHeader>

      <MessageList
        messages={conversation.messages}
        participants={conversation.participants}
        currentUserId={currentUserId}
        conversationStarted={conversation.startedAt}
      />

      <MessageInput
        onSendMessage={onSendMessage}
      />
    </ConversationViewContainer>
  );
};

export default ConversationView; 