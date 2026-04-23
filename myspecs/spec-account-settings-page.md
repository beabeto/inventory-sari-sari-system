# Page Spec: Account Settings

## Feature Name
Account Settings

## Purpose
Allow an authenticated user to manage profile details and account security.

## User Story
As a logged-in user, I want to update my username and change my password so I can maintain my account information securely.

## Current Route
`/account`

## UI Sections
- Sidebar navigation
- Page header
- Update username card
- Change password card
- Feedback message area

## Functional Requirements
- Allow updating username.
- Allow changing password using current and new password.
- Send authenticated requests with Bearer token.
- Show success or failure messages after each action.
- Clear input fields after successful updates.
- Allow logout from the sidebar.

## API Dependencies
- `PUT /users/update-profile`
- `PUT /users/change-password`
- Uses `Authorization: Bearer <token>`

## Request Payloads
```json
{
  "username": "new-username"
}
```

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

## Validation Rules
- Username is required for profile update.
- Current password is required for password change.
- New password is required for password change.
- User must be authenticated.

## Edge Cases
- Expired or missing token
- Username already in use
- Incorrect current password
- Backend validation errors returned as strings or arrays

## Acceptance Criteria
- Username update shows a clear success or failure message.
- Password change shows a clear success or failure message.
- Unauthorized requests are rejected by the backend.
