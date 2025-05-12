import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, styled } from '@mui/material';
import { User } from '../types/message';

interface ConversationItemProps {
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

const StyledListItem = styled(ListItem)<{ selected: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ConversationItem: React.FC<ConversationItemProps> = ({ user, isSelected, onClick }) => {
  return (
    <StyledListItem selected={isSelected} onClick={onClick}>
      <ListItemAvatar>
        <Avatar src={user.avatar} alt={user.name} />
      </ListItemAvatar>
      <ListItemText
        primary={user.name}
        secondary={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.title} {user.company ? `at ${user.company}` : ''}
          </Typography>
        }
      />
    </StyledListItem>
  );
};

export default ConversationItem; 