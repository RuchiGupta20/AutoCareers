// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/NavBar";
import FilterSearchBar from "./components/FilterBar";
import Recommendations from "./pages/Recommendations";

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
      <Navbar />

      {/* Here’s where we mount our routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/recommendations"
          element={<Recommendations />}
        />
        {/* You can add more routes here, e.g. <Route path="/search" element={<FilterSearchBar/>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
