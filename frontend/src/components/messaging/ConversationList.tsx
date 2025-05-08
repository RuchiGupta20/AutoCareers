import React from 'react';
import { Box, Typography, InputBase, styled, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ConversationItem from './ConversationItem';
import { User } from '../../types/message';

interface ConversationListProps {
  conversations: {
    id: string;
    user: User;
  }[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderBottom: '1px solid #eaeaea',
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: 8,
  flex: 1,
}));

const ConversationListContainer = styled(Box)(({ theme }) => ({
  width: '300px',
  height: '100%',
  borderRight: '1px solid #eaeaea',
  display: 'flex',
  flexDirection: 'column',
}));

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ConversationListContainer>
      <SearchContainer>
        <LightbulbIcon color="disabled" />
        <SearchInput
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton size="small">
          <SearchIcon />
        </IconButton>
      </SearchContainer>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              id={conv.id}
              user={conv.user}
              isSelected={selectedConversationId === conv.id}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">No conversations found</Typography>
          </Box>
        )}
      </Box>
    </ConversationListContainer>
  );
};

export default ConversationList; 