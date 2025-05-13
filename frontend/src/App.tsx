// src/App.tsx
import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/NavBar";
import MessageBoard from './pages/MessageBoard';
import RecruiterMessageBoard from './pages/RecruiterMessageBoard';

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
      <Navbar viewMode={viewMode} onSwitchProfile={handleSwitchProfile} />
      <div className="content">
        {viewMode === 'applicant' ? (
          <MessageBoard currentUser={applicantUser} />
        ) : (
          <RecruiterMessageBoard currentUser={recruiterUser} />
        )}
      </div>
    </div>
  );
}

export default App;
