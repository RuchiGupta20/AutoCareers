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
  Pagination,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StarBorder from "@mui/icons-material/StarBorder";
import ChevronRight from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const logoSrc = "/logo.png";

interface Recommendation {
  id: string;
  company: string;
  role: string;
  location: string;
  similarity_score: number;
  apply_link?: string;
  // you may have additional fields like `job_type`, `experience`, `salary`...
  job_type?: string;
  experience?: string;
  salary?: string;
}

export default function Recommendations() {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // 1) filter state
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState<string>("");
  const [salaryFilter, setSalaryFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");

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
      // reset filters when new data arrives
      setJobTypeFilter("");
      setExperienceFilter("");
      setSalaryFilter("");
      setLocationFilter("");
    } finally {
      setLoading(false);
    }
  };

  // 2) apply filters
  const filtered = results.filter((job) => {
    return (
      (!jobTypeFilter || job.job_type === jobTypeFilter) &&
      (!experienceFilter || job.experience === experienceFilter) &&
      (!salaryFilter || job.salary === salaryFilter) &&
      (!locationFilter || job.location === locationFilter)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box>
      {/* fixed AppBar */}
      <AppBar position="fixed" color="inherit" elevation={1} sx={{ zIndex: t => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box component="img" src={logoSrc} alt="AutoCareers" sx={{ height: 120, mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Job Board</Typography>

          {/* 3) Filters */}
          <Select
            size="small"
            value={jobTypeFilter}
            onChange={e => { setJobTypeFilter(e.target.value); setPage(1); }}
            displayEmpty
            sx={{ mx: 1, minWidth: 120 }}
          >
            <MenuItem value="">Job Type</MenuItem>
            <MenuItem value="Full-Time">Full-Time</MenuItem>
            <MenuItem value="Part-Time">Part-Time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </Select>

          <Select
            size="small"
            value={experienceFilter}
            onChange={e => { setExperienceFilter(e.target.value); setPage(1); }}
            displayEmpty
            sx={{ mx: 1, minWidth: 120 }}
          >
            <MenuItem value="">Experience</MenuItem>
            <MenuItem value="Entry">Entry</MenuItem>
            <MenuItem value="Mid">Mid</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
          </Select>

          <Select
            size="small"
            value={salaryFilter}
            onChange={e => { setSalaryFilter(e.target.value); setPage(1); }}
            displayEmpty
            sx={{ mx: 1, minWidth: 120 }}
          >
            <MenuItem value="">Salary</MenuItem>
            <MenuItem value="$40k-$60k">$40k–$60k</MenuItem>
            <MenuItem value="$60k-$80k">$60k–$80k</MenuItem>
            <MenuItem value="$80k+">$80k+</MenuItem>
          </Select>

          <Select
            size="small"
            value={locationFilter}
            onChange={e => { setLocationFilter(e.target.value); setPage(1); }}
            displayEmpty
            sx={{ mx: 1, minWidth: 120 }}
          >
            <MenuItem value="">Location</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="On-Site">On-Site</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
          </Select>

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
      {/* spacer below fixed AppBar */}
      <Toolbar />

      {/* Resume form */}
      <Box component="form" p={2} mt={8} onSubmit={handleSubmit}>
        <TextField
          label="Paste your resume text"
          multiline
          rows={4}
          fullWidth
          value={resume}
          onChange={e => setResume(e.target.value)}
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

      {/* Results grid */}
      <Box
        p={2}
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={2}
      >
        {paged.map(job => (
          <Card
            key={job.id}
            variant="outlined"
            sx={{
              bgcolor: "#FEF9E7",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {job.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.role}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {job.location}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
              <Button
                component="a"
                href={job.apply_link ?? "#"}
                target="_blank"
                variant="contained"
                color="success"
                size="small"
                sx={{ textTransform: "none" }}
              >
                Apply Now
              </Button>
              <Box>
                <IconButton aria-label="favorite">
                  <StarBorder />
                </IconButton>
                <IconButton>
                  <ChevronRight />
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        ))}
      </Box>

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
