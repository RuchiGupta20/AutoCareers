import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { User } from '../../types/message';

interface ConversationItemProps {
  id: string;
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationContainer = styled(Box)<{ selected: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '12px 16px',
  cursor: 'pointer',
  backgroundColor: selected ? 'rgba(245, 245, 220, 0.5)' : 'transparent',
  borderBottom: '1px solid #eaeaea',
  '&:hover': {
    backgroundColor: selected ? 'rgba(245, 245, 220, 0.6)' : 'rgba(0, 0, 0, 0.04)',
  },
}));

const ConversationItem: React.FC<ConversationItemProps> = ({ 
  id, 
  user, 
  isSelected, 
  onClick 
}) => {
  return (
    <ConversationContainer selected={isSelected} onClick={onClick}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {user.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {user.title || 'Recruiter'}
      </Typography>
    </ConversationContainer>
  );
};

export default ConversationItem; 