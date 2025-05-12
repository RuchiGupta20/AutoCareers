import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/NavBar';
import FilterSearchBar from './components/FilterBar'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApplicantsList from "./pages/ApplicantsList";
import ATSScore from "./pages/ATSScore";
import CoverLetterPage from './pages/CoverLetter';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
      <Routes>
        <Route path="/applicants" element={<ApplicantsList />} />
        <Route path="/ats-score" element={<ATSScore />} />
        <Route path='/generate-cover-letter' element={<CoverLetterPage />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
