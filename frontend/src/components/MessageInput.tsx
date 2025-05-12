import React, { useState } from 'react';
import { Box, TextField, IconButton, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <InputContainer>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          sx={{ mr: 1 }}
          multiline
          maxRows={4}
        />
        <IconButton 
          color="primary" 
          type="submit" 
          disabled={!message.trim()}
          sx={{ 
            alignSelf: 'center',
            backgroundColor: message.trim() ? 'primary.main' : 'transparent',
            color: message.trim() ? 'white' : 'action.disabled',
            '&:hover': {
              backgroundColor: message.trim() ? 'primary.dark' : 'action.hover',
            },
            width: 40,
            height: 40,
          }}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </form>
  );
};

export default MessageInput; 