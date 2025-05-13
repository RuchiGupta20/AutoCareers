import React from 'react';
import { Box, Typography, Avatar, styled } from '@mui/material';
import { Message, User } from '../types/message';

interface MessageItemProps {
  message: Message;
  sender: User;
  isCurrentUser: boolean;
}

const MessageContainer = styled(Box)<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  display: 'flex',
  flexDirection: isCurrentUser ? 'row-reverse' : 'row',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  width: '100%',
}));

const MessageBubble = styled(Box)<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  maxWidth: '70%',
  minWidth: '60px',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  backgroundColor: isCurrentUser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isCurrentUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  marginLeft: isCurrentUser ? 0 : theme.spacing(1),
  marginRight: isCurrentUser ? theme.spacing(1) : 0,
  wordBreak: 'break-word',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageContent = styled(Typography)({
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
});

const MessageItem: React.FC<MessageItemProps> = ({ message, sender, isCurrentUser }) => {
  return (
    <MessageContainer isCurrentUser={isCurrentUser}>
      {!isCurrentUser && (
        <Avatar
          src={sender.avatar}
          alt={sender.name}
          sx={{ width: 32, height: 32, marginRight: 1 }}
        />
      )}
      <Box sx={{ maxWidth: '80%' }}>
        {!isCurrentUser && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {sender.name}
          </Typography>
        )}
        <MessageBubble isCurrentUser={isCurrentUser}>
          <MessageContent variant="body1">{message.content}</MessageContent>
          <Typography 
            variant="caption" 
            color={isCurrentUser ? 'inherit' : 'text.secondary'} 
            sx={{ 
              opacity: 0.8, 
              alignSelf: 'flex-end',
              mt: 0.5
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </MessageBubble>
      </Box>
    </MessageContainer>
  );
};

export default MessageItem; 