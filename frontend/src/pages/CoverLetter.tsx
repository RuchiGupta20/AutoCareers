import React, { useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import CoverLetterCard from '../components/CoverLetterCard';


const CoverLetterPage: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) return;

    const formData = new FormData();
    formData.append('file', resumeFile);
    formData.append('job_description', jobDescription);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/generate-cover-letter", {
        method: "POST",
        body: formData,
      });

      setCoverLetter(await res.text());
    } catch (err) {
      console.error('Error generating cover letter:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3} sx={{ maxWidth: '800px', margin: 'auto', marginTop: 4 }}>
      <Grid size={12}>
        <Typography variant="h5" gutterBottom>
          Generate Cover Letter
        </Typography>
      </Grid>

      <Grid size={12}>
        <Button variant="contained" component="label">
          Upload Resume
          <input type="file" hidden onChange={handleFileChange} accept="application/pdf" />
        </Button>
        {resumeFile && <Typography sx={{ marginTop: 1 }}>{resumeFile.name}</Typography>}
      </Grid>

      <Grid size={12}>
        <TextField
          label="Job Description / Role"
          fullWidth
          multiline
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </Grid>

      <Grid size={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Cover Letter'}
        </Button>
      </Grid>

      {coverLetter && <CoverLetterCard coverLetter={coverLetter} />}
    </Grid>
  );
};

export default CoverLetterPage;
