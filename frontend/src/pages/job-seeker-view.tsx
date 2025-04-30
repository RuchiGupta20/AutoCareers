import React, { useState, useEffect } from "react";

export default function JobSeekerView() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resume, setResume] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const jobsPerPage = 7;

  // Function to fetch job recommendations from API
  const fetchJobs = async () => {
    if (!resume.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:8000/recommend", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resume_text: resume, top_k: 50 })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setJobs(data);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to fetch job recommendations. Please try again.");
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (jobId) => {
    setFavorites(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 ml-2">Job Seeker View</h1>
      
      {/* Header with navigation */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="flex items-center p-4 border-b">
          <svg className="h-6 w-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-semibold text-lg text-gray-700">Job Board</span>
        </div>
        
        {/* Filter bar */}
        <div className="flex flex-wrap items-center p-4 gap-2">
          <div className="flex items-center gap-1 mr-auto">
            <div className="bg-gray-200 p-2 rounded-full">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          
          {["Job Type", "Experience Level", "Salary Range", "Location"].map((filter) => (
            <div key={filter} className="text-sm text-gray-600 px-2">{filter}</div>
          ))}
          
          <div className="ml-auto relative">
            <svg className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Resume submission */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <textarea
          className="w-full h-32 border rounded-md p-3 focus:outline-none focus:ring"
          placeholder="Paste your resume here…"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={fetchJobs}
            disabled={loading || !resume.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Recommendations"}
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Job listings */}
      <div className="space-y-4">
        {currentJobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-white rounded-lg shadow border border-gray-100 p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{job.company}</p>
              <p className="text-gray-600 text-sm">{job.role}</p>
              <p className="text-gray-500 text-xs">{job.location}</p>
              <p className="text-gray-400 text-xs mt-1">Match Score: {Math.round(job.similarity_score * 100)}%</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={() => window.open(job.apply_link || '#', '_blank')}
              >
                Apply Now
              </button>
              <button 
                onClick={() => toggleFavorite(job.id)}
                className="p-1"
              >
                <svg 
                  className={`h-5 w-5 ${favorites[job.id] ? 'text-yellow-500' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
        
        {/* Empty state */}
        {jobs.length === 0 && !loading && (
          <div className="text-center p-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">Upload your resume to get job recommendations</p>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="text-center p-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">Finding job matches...</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-1">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-full border text-gray-500 disabled:opacity-50"
          >
            &lt;
          </button>
          
          {getPageNumbers().map((page, i) => (
            <button 
              key={i}
              onClick={() => typeof page === 'number' ? setCurrentPage(page) : null}
              className={`px-3 py-1 rounded-full ${
                page === currentPage 
                  ? 'bg-gray-200 font-medium' 
                  : page === '...' 
                    ? '' 
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-full border text-gray-500 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}