# Page Spec: Categories

## Feature Name
Category Management

## Purpose
Let users create, view, update, delete, and search product categories.

## Database Note
Category records are stored in the system database. Create, update, and delete actions must persist changes in the categories table.

## User Story
As a store user, I want to manage categories so that products stay organized and easy to browse.

## Current Route
`/categories`

## UI Sections
- Sidebar navigation
- Page header
- Add category input and button
- Search input
- Categories table

## Functional Requirements
- Load all categories on page open.
- Show category ID, name, product count, and stock count.
- Allow adding a new category.
- Allow inline editing of a category name.
- Allow deleting a category with confirmation.
- Allow searching categories by name.
- Show an empty state when no categories match the search.
- Allow logout from the sidebar.

## API Dependencies
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

## Data Requirements
- `category_id`
- `name`
- `productCount`
- `totalStock`

## Validation Rules
- Category name is required when adding.
- Category name is required when saving edits.
- Delete action should require confirmation.

## Edge Cases
- Backend returns slightly different field names
- Duplicate category names
- Deleting a category that is still referenced by products
- Search returns no matches

## Acceptance Criteria
- New categories appear in the table after creation.
- Edited categories update without reloading the page manually.
- Deleted categories are removed from the table.
- Search filters the list by category name.
