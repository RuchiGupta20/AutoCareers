# Running the Messaging System

The application now uses a tab-based approach to switch between Applicant and Recruiter views.

## Running the Application

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and go to http://localhost:3000

5. Use the tabs at the top of the page to switch between:
   - Applicant View - For job seekers to message recruiters
   - Recruiter View - For recruiters to message applicants

## Development

The tab switching is implemented in App.tsx using Material UI Tabs component, with conditional rendering of either MessageBoard or RecruiterMessageBoard components based on the selected tab. 