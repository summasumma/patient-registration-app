Patient Registration App
A frontend-only React application for registering and querying patient records using PGlite for local PostgreSQL storage. The app supports data persistence across page refreshes and synchronizes data across multiple browser tabs.
Features

Patient Registration: Register patients with full name, age, gender, contact info, and address, with input validation.
Query Records: Execute raw SQL queries against the patient database and display results in a table.
Data Persistence: Patient data persists across page refreshes using PGlite's IndexedDB storage.
Multi-tab Synchronization: Changes in one tab are reflected in other tabs using BroadcastChannel.

Setup
Prerequisites

Node.js (v16 or higher)
Git
A modern web browser (Chrome, Firefox, Edge)

Installation

Clone the repository:
git clone https://github.com/your-username/patient-registration-app.git
cd patient-registration-app

Install dependencies:
npm install

Run the app locally:
npm run dev

The app will open at http://localhost:5173.

Usage

Register a Patient:

Fill out the registration form with the patient's details.
Required fields: Full Name, Age (must be a positive number), Gender.
Click the "Register" button to save the patient data.
A success message will confirm the registration.

Query Patient Records:

Enter a raw SQL query in the query textarea (e.g., SELECT _ FROM patients).
Click the "Execute Query" button to view the results in a table.
Example queries:
SELECT full_name, age FROM patients WHERE age > 30
SELECT _ FROM patients WHERE gender = 'Female'

Test Persistence:

Register a few patients, then refresh the page.
Run SELECT \* FROM patients to confirm the data is still available.

Test Multi-tab Synchronization:

Open the app in two browser tabs.
Register a patient in one tab.
Run a query in the second tab to see the new patient data.

Deployment
The app is deployed on Vercel at: https://patient-registration-app.vercel.app
To deploy your own version:

Push the repository to GitHub.
Connect the repository to Vercel via the Vercel dashboard.
Deploy the app and access the public URL provided by Vercel.

Challenges Faced

Learning PGlite:

Understanding PGlite's async API and IndexedDB integration was initially challenging.
Solution: Studied the official PGlite documentation and tested basic queries in a sandbox environment.

Handling SQL Queries:

Ensuring safe execution of user-provided SQL queries without exposing the app to injection risks.
Solution: Used PGlite's parameterized queries for inserts and relied on its error handling for invalid queries.

Managing Cross-tab Data Consistency:

Synchronizing data across tabs without reloading the entire app was complex.
Solution: Implemented BroadcastChannel to notify tabs of data changes, triggering query re-execution.

Tailwind CSS Integration:

Initial use of the Tailwind CDN caused a production warning.
Solution: Migrated to a proper Tailwind CSS setup with PostCSS and Vite, ensuring optimized CSS output.

Git Workflow
The repository follows a feature-based commit strategy:

feat: Initialize React app with Vite and PGlite
feat: Add patient registration form with validation
feat: Implement SQL query executor and result table
fix: Ensure data persistence with PGlite
feat: Add multi-tab synchronization with BroadcastChannel
fix: Replace Tailwind CDN with PostCSS integration
docs: Update README with new setup instructions

License
MIT License
