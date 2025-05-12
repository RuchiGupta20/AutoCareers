import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Grid
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ATSFeedbackCard from "../components/ATSFeedbackCard";

const AtsScore = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ats-score", {
        method: "POST",
        body: formData,
      });

      const data = await res.text();
      setResponse(data);

      const scoreMatch = data.match(/\*\*ATS Score\*\*:\s*(\d+)/);
      if (scoreMatch) {
        setScore(scoreMatch[1]);
      }
    } catch (err) {
      setResponse("An error occurred while uploading the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Upload Resume to Get ATS Score
      </Typography>

      <input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={handleSubmit}
        sx={{ mt: 4, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : "Get ATS Score"}
      </Button>

      {score && (
        <Grid container spacing={2} sx={{ mt: 2, width: '100%', maxWidth: '1280px', marginBottom: 0 }}>
          <Grid size={12}>
            <Paper elevation={3} sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e8f5e9' }}>
              <Typography variant="h6" sx={{ color: 'green' }}>
                🎯 ATS Score: {score}%
              </Typography>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Paper elevation={1} sx={{ p: 0, whiteSpace: 'pre-line' }}>
              <Typography variant="body1" color="textPrimary">
                {response && <ATSFeedbackCard atsResponse={{ ats_score: response }} />}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AtsScore;
