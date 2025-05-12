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

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="small"
          sx={{ mr: 1 }}
        />
        <IconButton 
          color="primary" 
          type="submit" 
          disabled={!message.trim()}
          sx={{ alignSelf: 'center' }}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </form>
  );
};

export default MessageInput; 