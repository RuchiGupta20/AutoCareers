# AutoCareers

## Development Commands for Windows PowerShell

Since Windows PowerShell doesn't support the `&&` operator for command chaining, use these commands instead:

```powershell
# Start the frontend application
cd frontend; npm start

# Run tests
cd frontend; npm test

# Build the application
cd frontend; npm run build
```

For multiple commands, use semicolons (`;`) to separate commands in PowerShell.

## Project Structure

- `/frontend` - React frontend application
  - `/src/components` - UI components
  - `/src/pages` - Page components
  - `/src/services` - API and data services
  - `/src/types` - TypeScript type definitions

## Project Overview
AutoCareers is designed to streamline the job search process for job seekers and recruiters by providing an intuitive platform for job listings, applications, and candidate management. The platform offers advanced features such as resume parsing, ATS scoring, filtering and search, recruiter and user-specific views, direct messaging, and job applications. By leveraging modern web technologies, AI-driven resume analysis, and automation, the platform aims to improve hiring efficiency and enhance the job-seeking experience.

## Project Purpose
The purpose of this project is to bridge the gap between job seekers and recruiters by offering a user-friendly, data-driven, and automated job search platform. The website will enhance job search efficiency by helping applicants optimize their resumes, filter jobs based on their preferences, and even apply to jobs with customized cover letters. For recruiters, it will provide tools to manage applicants, filter resumes based on ATS scores, and communicate efficiently with potential hires.

## Problem Statement
Traditional job search platforms often suffer from information overload, inefficient matching, and poor communication between job seekers and recruiters. Candidates struggle to find relevant job opportunities, optimize their resumes for ATS systems, and track applications effectively. Recruiters, on the other hand, face difficulties in filtering qualified candidates, managing multiple applications, and ensuring smooth communication. This project aims to create a modern, AI-enhanced job board that simplifies the hiring process, making it faster and more effective for both job seekers and recruiters.

## Target Users
- **Job Seekers:** Individuals looking for jobs, internships, or career opportunities who want an efficient way to apply, track applications, and optimize their resumes.
- **Recruiters & Hiring Managers:** Employers and HR professionals looking for an easy way to view profiles, filter candidates, and manage applications.
- **Career Coaches & Resume Experts:** Professionals who assist job seekers with resume optimization and job search strategies.
- **Students & Recent Graduates:** Entry-level professionals seeking internships and first-time job opportunities.

---

## Features

### **Key Features of the AutoCareers Website**

### **User Authentication**
- Secure login and account access for job seekers and recruiters using email/password or third-party authentication.

### **Role Management**
- Different access levels for job seekers and recruiters, ensuring role-specific features and permissions.

### **Job Listing Aggregation**
- The platform automatically scrapes and aggregates job listings from various sources, keeping job postings up-to-date.

### **Job Search and Filtering**
- Users can search for jobs using keywords and apply filters such as location, job type, experience level, and salary range.

### **Resume Uploading**
- Job seekers can upload resumes in various formats (PDF, DOCX), which are stored in their profile for applications.

### **ATS Scoring and Resume Parsing**
- The system analyzes uploaded resumes, extracts key details, and scores them for compatibility with job descriptions.

### **Resume Optimization and Editing**
- AI-powered resume tool that provides formatting, keyword recommendations, and ATS-friendly enhancements to improve job application success.

### **Recruiter Job Management**
- Recruiters can review applicant profiles.

### **Messaging System**
- Direct messaging between job seekers and recruiters for interviews, follow-ups, and inquiries.
- MongoDB-based storage for conversations and messages
- Message read status tracking
- Conversation management with user profiles

### **Automatic Cover Letter Generation**
- AI-based cover letter creation tailored to each job description, incorporating details from the user's profile and resume.

### **Security and Data Protection**
- Ensuring secure handling of user data, protected access, and privacy measures to safeguard sensitive information.

---

## **Reach Goals (If Time Permits, We May Add)**

### **Automated Job Applications**
- Users can enable automatic applications for jobs matching their preferences, streamlining the application process.

### **Resume Editing and Optimization**
- AI-powered automatic resume editor providing formatting suggestions, keyword optimization, and ATS improvements.

### **User Profile and Application Tracking**
- Dashboard for users to manage their profiles, view saved jobs, track application status, and receive job recommendations.
