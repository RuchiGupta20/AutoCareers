import React from "react";
import { Paper, Typography, Box } from "@mui/material";

interface ATSFeedbackCardProps {
  atsResponse: {
    ats_score: string;
  };
}

const ATSFeedbackCard: React.FC<ATSFeedbackCardProps> = ({ atsResponse }) => {
  const text = atsResponse.ats_score;

  // Normalize the text:
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1')         // remove bold markdown
    .replace(/\\n/g, '\n')                   // unescape \n
    .replace(/\\+/g, '')                     // remove backslashes
    .replace(/["“”]/g, '')                   // clean quotes
    .replace("{", "")
    .replace("}", "")
    .replace("ats_score:ATS Score and Feedback:", "")                  
    .trim();

  // Split into lines by double newlines and bullets
  const bulletPoints = cleanText
    .split(/\n{2,}/)                         // paragraph breaks
    .flatMap(p => p.split('\n- '))           // handle "- bullet" cases
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <Paper elevation={3} sx={{ p: 1, mt: 1, width: '100%', maxWidth: '1280px', mx: 'auto' }}>
      <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold', mb: 4, textAlign: 'justify' }}>
        🎯 ATS Score and Feedback
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {bulletPoints.map((line, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Typography variant="body1" sx={{ textAlign: 'justify' }}>
              {line}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ATSFeedbackCard;
