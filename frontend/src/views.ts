// Helper function to detect which view to render
export const isRecruiterView = () => {
  return window.location.pathname.includes('recruiter');
};

export const isApplicantView = () => {
  return !isRecruiterView();
}; 