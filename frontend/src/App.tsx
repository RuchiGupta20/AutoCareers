// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/NavBar";
import FilterSearchBar from "./components/FilterBar";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
function Home() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Welcome to AutoCareers! Navigate to <code>/recommendations</code> to see
        personalized job matches.
      </p>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Recommendations" element={<Recommendations />} />
        <Route path="/login" element={<Login />} />   {/* ← new route */}
        {/* add /signup and /forgot-password later if you like */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
