# Feature Spec: Sidebar Profile Image

## Status
Accepted for implementation

## Feature Name
Sidebar Profile Image

## Goal
Add a user profile image that appears in the sidebar on all authenticated pages and can be updated from the Account Settings page.

## Scope
- Persist one profile image value per user in the backend database.
- Expose the profile image through the authenticated user profile endpoint.
- Allow the Account Settings page to load, edit, and save the profile image.
- Show the saved profile image in the sidebar across:
  - Dashboard
  - Categories
  - Products
  - Sales
  - Utang
  - Expenses
  - Account Settings

## Non-Goals
- File upload support
- Image cropping, resizing, or compression
- Multiple profile images
- Public profile pages

## Requirements
- `SSIMS-PROFILE-001`: The system must persist a profile image string for each user.
- `SSIMS-PROFILE-002`: `GET /users/me` must return the authenticated user's profile image together with the existing profile fields.
- `SSIMS-PROFILE-003`: `PUT /users/update-profile` must allow updating the profile image without requiring a password change.
- `SSIMS-PROFILE-004`: The Account Settings page must let the user edit and save the profile image value.
- `SSIMS-PROFILE-005`: All authenticated page sidebars must display the saved profile image and current username.
- `SSIMS-PROFILE-006`: If no profile image is set, the sidebar must show a safe fallback avatar state instead of a broken image.

## API Contract

### `GET /users/me`
Response:

```json
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "profileImage": "https://example.com/avatar.jpg"
}
```

### `PUT /users/update-profile`
Request payload:

```json
{
  "username": "admin",
  "profileImage": "https://example.com/avatar.jpg"
}
```

Response:

```json
{
  "message": "Profile updated successfully"
}
```

## UI Behavior
- The sidebar must render the user image above or near the navigation items.
- The sidebar must render the username from the authenticated profile.
- The Account Settings page must preload the current username and profile image.
- Saving account settings must update the sidebar-rendered profile state after a successful request.

## Validation
- Username remains required when updating the profile.
- Profile image is optional.
- An empty profile image value clears the saved image and reverts the UI to the fallback avatar state.

## Edge Cases
- Authenticated request succeeds but the user has no profile image.
- The profile image URL is invalid or fails to load in the browser.
- The backend returns an older user record without a profile image value.
- The update request changes username only.
- The update request changes profile image only while preserving the existing username value.

## Acceptance Criteria
- A logged-in user can open Account Settings, enter a profile image value, save it, and see the image appear in the sidebar.
- The saved profile image remains visible after navigation to other authenticated pages.
- Clearing the profile image removes the image and shows the fallback avatar state.
- Existing username update behavior still works.
- Password change behavior remains unchanged.

## Verification
- Backend test coverage for profile serialization and profile updates.
- Frontend test coverage for account profile loading and saving.
- Manual smoke test across all authenticated pages.
