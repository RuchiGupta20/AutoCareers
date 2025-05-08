import React, { useState, KeyboardEvent } from 'react';
import { Box, InputBase, IconButton, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  borderTop: '1px solid #eaeaea',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: '8px 12px',
  borderRadius: '20px',
  backgroundColor: '#f5f5f5',
  '&.Mui-focused': {
    backgroundColor: '#fff',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  },
}));

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <InputContainer>
      <IconButton size="small" sx={{ mr: 1 }}>
        <SentimentSatisfiedAltIcon />
      </IconButton>
      <StyledInputBase
        fullWidth
        placeholder="Reply message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        multiline
        maxRows={4}
      />
      <IconButton 
        color="primary" 
        onClick={handleSendMessage} 
        disabled={!message.trim() || disabled}
        sx={{ ml: 1 }}
      >
        <SendIcon />
      </IconButton>
    </InputContainer>
  );
};

export default MessageInput; 