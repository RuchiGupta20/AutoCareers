import React from 'react';
import './App.css';
import Navbar from './components/NavBar';
import MessageBoard from './components/messaging/MessageBoard';

function App() {
  // Sample current user
  const currentUser = {
    id: 4, // This would be fetched from authentication system
    name: 'You',
    type: 'applicant' as 'recruiter' | 'applicant',
  };

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <MessageBoard currentUser={currentUser} />
      </div>
    </div>
  );
}

export default App;
