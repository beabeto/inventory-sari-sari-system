Name: Beatrix Coleen Beto
Section: BSICT-3B1
________________________________________
Assignment 1: Implement Two Small Features in Sari-Sari Inventory System
Feature 1: Login System
Feature Name
Login System (Authentication using JWT)
Purpose
To allow users to securely access the system by verifying their username and password.
Expected User
Store owner or staff who needs access to the inventory system.
Main Functionality
•	User enters username and password
•	System validates credentials using backend (NestJS)
•	If valid, system generates a JWT token
•	Token is stored in localStorage
•	User is redirected to the dashboard
Acceptance Criteria
1.	User can input username and password in the login form
2.	System displays an error message if credentials are incorrect
3.	User is redirected to dashboard after successful login
4.	JWT token is stored in localStorage after login
5.	Login connects properly to backend API
________________________________________
Feature 2: Dashboard Page
Feature Name
Dashboard Interface
Purpose
To provide a simple landing page after login where users can access system features.
Expected User
Authenticated users (store owner or staff)
Main Functionality
•	Displays welcome message
•	Provides logout button
•	Allows user to exit the system securely
•	Styled with a blue theme UI
Acceptance Criteria
1.	Dashboard is only accessible after login
2.	Displays a welcome message to the user
3.	Logout button removes token from localStorage
4.	User is redirected to login page after logout
5.	UI is styled and user-friendly
________________________________________
What I Implemented
•	Created a login page in React with username and password inputs
•	Connected frontend to backend using fetch API
•	Implemented authentication using NestJS + JWT
•	Stored authentication token in localStorage
•	Created a dashboard page with blue theme design
•	Implemented logout functionality
•	Connected frontend and backend successfully
•	Configured MySQL database for user storage
•	Seeded a test user (admin / admin123)
________________________________________
Problems / Challenges Encountered
•	Difficulty connecting NestJS to MySQL due to incorrect credentials
•	Login initially failed because no user existed in the database
•	Issues running seed file due to incorrect file path
•	Confusion using PowerShell curl vs Invoke-RestMethod
•	Password mismatch issues due to bcrypt hashing
•	Debugging API connection between frontend and backend
________________________________________
Screenshots (2–6 required)
1.	Login page UI
 
2.	Successful login (dashboard view)
 
3.	Failed login attempt
 
________________________________________
Git Workflow
•	Created feature branches:
o	feature/login
o	feature/dashboard
•	Used meaningful commit messages:
o	add login UI
o	connect login to backend
o	implement JWT authentication
o	create dashboard UI
o	add logout functionality
•	Shows step-by-step development progress
________________________________________

