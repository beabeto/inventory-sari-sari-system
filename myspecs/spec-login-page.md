# Page Spec: Login

## Feature Name
Login Page

## Purpose
Allow a user to authenticate with username and password and enter the protected SSIMS pages.

## Database Note
This page authenticates against user records stored in the system database. User credentials and account data are persisted in the backend database.

## User Story
As an admin or cashier, I want to log in using my account so I can access the store system securely.

## Current Route
`/login`

## UI Sections
- Store title and subtitle
- Username input
- Password input
- Login button

## Functional Requirements
- User can enter `username`.
- User can enter `password`.
- On submit, the page sends credentials to the backend login endpoint.
- If login succeeds, the access token is saved to `localStorage`.
- After successful login, the user is redirected to `/dashboard`.
- If login fails, the page shows a simple failure alert.

## API Dependency
- `POST /auth/login`

## Request Payload
```json
{
  "username": "string",
  "password": "string"
}
```

## Expected Response
```json
{
  "access_token": "jwt-token"
}
```

## Validation Rules
- Username is required.
- Password is required.
- Empty form should not result in silent success.

## Edge Cases
- Invalid username or password
- Backend unavailable
- Token missing from response

## Acceptance Criteria
- Valid credentials redirect the user to Dashboard.
- Invalid credentials keep the user on Login and show an error.
- Protected pages remain inaccessible without a valid token.
