import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

interface CoverLetterCardProps {
  coverLetter: string;
}

const CoverLetterCard: React.FC<CoverLetterCardProps> = ({ coverLetter }) => {
  // Optional: sanitize or extract clean text
  const cleanText = coverLetter
    .replace(/^{|}$/g, '') // remove surrounding braces if present
    .replace(/\\n/g, '\n') // convert \n to real line breaks
    .replace("\"cover_letter\":\"Generated Cover Letter:", "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanText);
      alert("Cover letter copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '1.5rem', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          📄 Generated Cover Letter
        </Typography>
        <Button variant="outlined" onClick={handleCopy}>
          Copy
        </Button>
      </Box>
      <Typography variant="body1">
        {cleanText}
      </Typography>
    </Paper>
  );
};

export default CoverLetterCard;
