# Page Spec: Login and Registration

## Feature Name
Login and Registration

## Purpose
Allow a user to log in with username and password, and allow a new user to register an account before entering the protected SSIMS pages.

## Database Note
This flow authenticates against user records stored in the system database. User credentials and account data are persisted in the backend database.

## User Story
As an admin or cashier, I want to log in using my account so I can access the store system securely.

As a new user, I want to register with a username and password so I can create an account before logging in.

## Current Routes
- `/login`
- `/register`

## UI Sections
- Store title and subtitle
- Username input
- Password input
- Login button
- Register link from the login page
- Register page with username input
- Register page with password input
- Create account button

## Functional Requirements
- User can enter `username`.
- User can enter `password`.
- On login submit, the page sends credentials to the backend login endpoint.
- If login succeeds, the access token is saved to `localStorage`.
- After successful login, the user is redirected to `/dashboard`.
- If login fails, the page shows a simple failure alert.
- User can open the register page from the login page.
- User can create an account using username and password.
- If registration succeeds, the user is redirected back to `/login`.
- If registration fails, the page shows an error message.

## API Dependencies
- `POST /auth/login`
- `POST /auth/register`

## Login Request Payload
```json
{
  "username": "string",
  "password": "string"
}
```

## Login Expected Response
```json
{
  "access_token": "jwt-token"
}
```

## Register Request Payload
```json
{
  "username": "string",
  "password": "string"
}
```

## Validation Rules
- Username is required.
- Password is required.
- Empty login form should not result in silent success.
- Empty registration form should not result in silent success.
- Registration should reject duplicate usernames.

## Edge Cases
- Invalid username or password
- Backend unavailable
- Token missing from login response
- Duplicate username during registration
- Registration succeeds but login is attempted with the wrong password

## Acceptance Criteria
- Valid credentials redirect the user to Dashboard.
- Invalid credentials keep the user on Login and show an error.
- Protected pages remain inaccessible without a valid token.
- The login page includes a clear path to registration.
- Successful registration creates a new user account and returns the user to the login page.
