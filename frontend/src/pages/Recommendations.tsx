// src/pages/Recommendations.tsx
import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Pagination,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StarBorder from "@mui/icons-material/StarBorder";
import ChevronRight from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

interface Recommendation {
  id: string;
  company: string;
  role: string;
  location: string;
  similarity_score: number;
  apply_link?: string;
}

export default function Recommendations() {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post<Recommendation[]>(
        "http://localhost:8000/recommend",
        { resume_text: resume, top_k: 50 }
      );
      setResults(data);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  const paged = results.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(results.length / pageSize);

  return (
    <Box>
      {/* Top AppBar */}
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <IconButton edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Job Board
          </Typography>
          {/* Filters */}
          {["Job Type", "Experience", "Salary", "Location"].map((label) => (
            <Select
              key={label}
              displayEmpty
              size="small"
              sx={{ mx: 1, minWidth: 120 }}
              value=""
            >
              <MenuItem value="">{label}</MenuItem>
            </Select>
          ))}
          <TextField
            size="small"
            placeholder="Search…"
            sx={{ minWidth: 200 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Resume form */}
      <Box component="form" p={2} onSubmit={handleSubmit}>
        <TextField
          label="Paste your resume text"
          multiline
          rows={4}
          fullWidth
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Loading…" : "Get Recommendations"}
        </Button>
      </Box>

      {/* Job cards grid */}
      <Grid container spacing={2} px={2}>
        {paged.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card
              variant="outlined"
              sx={{
                bgcolor: "#FEF9E7",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {job.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.role}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  href={job.apply_link}
                  target="_blank"
                  sx={{ textTransform: "none" }}
                >
                  Apply Now
                </Button>
                <IconButton>
                  <StarBorder />
                </IconButton>
                <IconButton>
                  <ChevronRight />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box textAlign="center" my={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
