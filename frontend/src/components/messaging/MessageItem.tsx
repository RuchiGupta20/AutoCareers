import React from 'react';
import { Box, Typography, Avatar, styled } from '@mui/material';
import { Message, User } from '../../types/message';
import { formatDistanceToNow } from 'date-fns';

interface MessageItemProps {
  message: Message;
  sender: User;
  isCurrentUser: boolean;
}

const MessageContainer = styled(Box)<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  display: 'flex',
  flexDirection: isCurrentUser ? 'row-reverse' : 'row',
  gap: '12px',
  marginBottom: '16px',
  paddingLeft: '16px',
  paddingRight: '16px',
}));

const MessageBubble = styled(Box)<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  backgroundColor: isCurrentUser ? '#e8f5e9' : '#fff',
  borderRadius: '12px',
  padding: '12px 16px',
  maxWidth: '70%',
  boxShadow: isCurrentUser ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)',
  border: isCurrentUser ? 'none' : '1px solid #e0e0e0',
}));

const MessageItem: React.FC<MessageItemProps> = ({ message, sender, isCurrentUser }) => {
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  
  return (
    <MessageContainer isCurrentUser={isCurrentUser}>
      {!isCurrentUser && (
        <Avatar 
          src={sender.avatar} 
          alt={sender.name}
          sx={{ width: 36, height: 36 }}
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '70%' }}>
        {!isCurrentUser && (
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
            {sender.name}
          </Typography>
        )}
        <MessageBubble isCurrentUser={isCurrentUser}>
          <Typography variant="body1">{message.content}</Typography>
        </MessageBubble>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            mt: 0.5
          }}
        >
          {formattedTime}
        </Typography>
      </Box>
      {isCurrentUser && (
        <Avatar 
          src={sender.avatar} 
          alt="You"
          sx={{ width: 36, height: 36 }}
        />
      )}
    </MessageContainer>
  );
};

export default MessageItem; 