import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/NavBar';
import FilterSearchBar from './components/FilterBar'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApplicantsList from "./pages/ApplicantsList"; // Adjust the path as needed

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
      <Routes>
        <Route path="/applicants" element={<ApplicantsList />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
