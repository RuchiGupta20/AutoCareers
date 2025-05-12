<<<<<<< HEAD
// src/App.tsx
import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/NavBar";
import MessageBoard from './pages/MessageBoard';
import RecruiterMessageBoard from './pages/RecruiterMessageBoard';
import { Box } from '@mui/material';
=======
import React from 'react';
import './App.css';
import Navbar from './components/NavBar';
import FilterSearchBar from './components/FilterBar'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApplicantsList from "./pages/ApplicantsList";
import ATSScore from "./pages/ATSScore";
import CoverLetterPage from './pages/CoverLetter';
>>>>>>> 62045ff76fb262adc95e09f8eb9872615fc9b264

function App() {
  const [viewMode, setViewMode] = useState<'applicant' | 'recruiter'>('applicant');

  // Sample applicant user
  const applicantUser = {
    id: 4, // This would be fetched from authentication system
    name: 'You (Applicant)',
    type: 'applicant' as const,
  };

  // Sample recruiter user
  const recruiterUser = {
    id: 5, // Different ID for the recruiter
    name: 'You (Recruiter)',
    type: 'recruiter' as const,
  };

  // Handler for profile switching from NavBar
  const handleSwitchProfile = (mode: 'applicant' | 'recruiter') => {
    setViewMode(mode);
  };

  return (
    <div className="App">
<<<<<<< HEAD
      <Navbar viewMode={viewMode} onSwitchProfile={handleSwitchProfile} />
      <div className="content">
        {viewMode === 'applicant' ? (
          <MessageBoard currentUser={applicantUser} />
        ) : (
          <RecruiterMessageBoard currentUser={recruiterUser} />
        )}
      </div>
=======
      <Navbar />
      <Router>
      <Routes>
        <Route path="/applicants" element={<ApplicantsList />} />
        <Route path="/ats-score" element={<ATSScore />} />
        <Route path='/generate-cover-letter' element={<CoverLetterPage />} />
      </Routes>
    </Router>
      
>>>>>>> 62045ff76fb262adc95e09f8eb9872615fc9b264
    </div>
  );
}

export default App;
