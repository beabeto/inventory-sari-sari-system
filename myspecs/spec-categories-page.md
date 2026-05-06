# Page Spec: Categories

## Feature Name
Category Management Page And Backend API

## Source Of Truth
This spec is based on the current category frontend and backend implementation:

```text
frontend/sari-sari-frontend/src/pages/Categories.tsx
backend/sari-sari-backend/src/categories/categories.controller.ts
backend/sari-sari-backend/src/categories/categories.service.ts
backend/sari-sari-backend/src/categories/category.entity.ts
backend/sari-sari-backend/src/categories/categories.module.ts
```

## Purpose
Let an authenticated store user view, add, search, rename, and delete their own inventory categories from the `/categories` page.

## Current Route
`/categories`

## Page Layout
- Sidebar navigation with `categories` as the active page
- Page title: `Categories`
- Subtitle: `Manage and organize your inventory groupings`
- Add category input and `+ Add Category` button
- Search categories input
- Categories table
- Empty search result message

## Displayed Table Columns
- `Category Name`
- `Products Count`
- `Stock Count`
- `Actions`

## Frontend Data Model
The page maps backend category records into this frontend shape:

```ts
interface Category {
  category_id: number;
  name: string;
  productCount: number;
  totalStock: number;
}
```

The frontend accepts both direct and aliased backend field names:

- `category_id` or `category_category_id`
- `name` or `category_name`
- `productCount` or `category_productCount`
- `totalStock`

Missing counts default to `0`.

## API Dependencies
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

All requests use the shared Axios client configured with:

```text
http://localhost:3000
```

## Backend Module
The backend category feature is implemented as a NestJS module:

- `CategoriesModule` registers the `Category` repository with `TypeOrmModule.forFeature([Category])`.
- `CategoriesController` exposes the `/categories` API routes.
- `CategoriesService` contains the database logic for listing, creating, updating, and deleting categories.
- `Category` maps to the `categories` database table.

## Backend Entity
The `Category` entity uses these fields and relationships:

```ts
@Entity('categories')
export class Category {
  category_id: number;
  name: string;
  user_id?: number;
  products: Product[];
}
```

- `category_id` is the primary generated ID.
- `name` stores the category name.
- `user_id` links the category to the user who created it.
- `products` is a one-to-many relation used to count products and total stock.

## Backend API Behavior

### `GET /categories`
- Requires JWT authentication.
- Reads the current user from `req.user`.
- Returns only categories where `category.user_id` matches `req.user.userId`.
- Left joins related products.
- Returns category ID, name, product count, and total stock.
- Converts numeric aggregate values to numbers before returning them.

Example response item:

```json
{
  "category_id": 1,
  "name": "Snacks",
  "productCount": 5,
  "totalStock": 120
}
```

### `POST /categories`
- Requires JWT authentication.
- Accepts a JSON body with `name`.
- Creates a category owned by the authenticated user.
- Saves `user_id` from `req.user.userId`.

Example request:

```json
{
  "name": "Snacks"
}
```

### `PUT /categories/:id`
- Requires JWT authentication.
- Accepts a category ID route parameter.
- Accepts a JSON body with `name`.
- Updates only a category owned by the authenticated user.
- Returns `404 Not Found` with `Category not found or access denied` when the category does not exist or belongs to another user.

Example request:

```json
{
  "name": "Beverages"
}
```

### `DELETE /categories/:id`
- Requires JWT authentication.
- Accepts a category ID route parameter.
- Deletes only a category owned by the authenticated user.
- Returns `404 Not Found` with `Category not found or access denied` when the category does not exist or belongs to another user.

## Functional Requirements
- `SSIMS-CATEGORY-001`: On page load, fetch categories from `GET /categories`.
- `SSIMS-CATEGORY-002`: Display each category name, product count, total stock count, and row actions.
- `SSIMS-CATEGORY-003`: Add a new category by sending `POST /categories` with `{ name: newCategory }`.
- `SSIMS-CATEGORY-004`: Clear the add-category input after a successful create.
- `SSIMS-CATEGORY-005`: Refresh the category list after successful create, update, or delete actions.
- `SSIMS-CATEGORY-006`: Do not submit a new category when the input is blank or whitespace only.
- `SSIMS-CATEGORY-007`: Search categories by name using a case-insensitive frontend filter.
- `SSIMS-CATEGORY-008`: Show `No categories found matching your search.` when the filtered list is empty.
- `SSIMS-CATEGORY-009`: Start inline edit mode when the user clicks `Edit`.
- `SSIMS-CATEGORY-010`: In edit mode, replace the category name text with an autofocus text input.
- `SSIMS-CATEGORY-011`: Save an edit with the `Save` button or by pressing `Enter`.
- `SSIMS-CATEGORY-012`: Cancel an edit with the `Cancel` button or by pressing `Escape`.
- `SSIMS-CATEGORY-013`: Do not save an edit when the edit input is blank or whitespace only.
- `SSIMS-CATEGORY-014`: Confirm deletion with the browser message `Delete this category?`.
- `SSIMS-CATEGORY-015`: Delete only after confirmation by sending `DELETE /categories/:id`.
- `SSIMS-CATEGORY-016`: Require JWT authentication for every backend category route.
- `SSIMS-CATEGORY-017`: Return only categories owned by the authenticated user.
- `SSIMS-CATEGORY-018`: Assign newly-created categories to the authenticated user's `userId`.
- `SSIMS-CATEGORY-019`: Calculate `productCount` using the number of related products.
- `SSIMS-CATEGORY-020`: Calculate `totalStock` using the sum of related product stock values.
- `SSIMS-CATEGORY-021`: Return `0` total stock when a category has no products.
- `SSIMS-CATEGORY-022`: Prevent updating categories owned by another user.
- `SSIMS-CATEGORY-023`: Prevent deleting categories owned by another user.
- `SSIMS-CATEGORY-024`: Return a not-found/access-denied error when update or delete cannot find an owned category.

## UI Behavior
- Category names display in blue.
- Product counts display in green with stronger font weight.
- Stock counts display in red with stronger font weight.
- Normal row actions are `Edit` and `Delete`.
- Edit row actions are `Save` and `Cancel`.
- The add input placeholder is `Enter new category name...`.
- The search input placeholder is `Search categories...`.

## Validation Rules
- Add category name is required.
- Edited category name is required.
- Delete requires browser confirmation.
- Search does not call the backend; it filters the already-loaded category list.
- Backend routes require a valid JWT token.
- Backend update and delete operations must match both `category_id` and `user_id`.

## Edge Cases
- Backend returns alternative category field aliases.
- Backend omits product or stock counts.
- Add input contains only spaces.
- Edit input contains only spaces.
- Search text has different capitalization than category names.
- Search returns zero matching categories.
- User cancels deletion from the browser confirmation.
- API request fails; the frontend logs the error to the console.
- Authenticated user has no categories.
- Category has no related products.
- Related products have null or zero stock values.
- User tries to update a category ID owned by another user.
- User tries to delete a category ID owned by another user.
- User sends a request without a valid JWT token.

## Acceptance Criteria
- Categories load and appear in the table when the page opens.
- Creating a valid category clears the input and refreshes the table.
- Blank add attempts do not call the create API.
- Search filters category rows by name without a page reload.
- Clicking `Edit` changes only that row into edit mode.
- Pressing `Enter` or clicking `Save` updates a valid edited name.
- Pressing `Escape` or clicking `Cancel` exits edit mode without saving.
- Clicking `Delete` asks for confirmation before calling the delete API.
- The empty state appears when no rows match the search.
- Backend list response includes only the logged-in user's categories.
- Backend list response includes numeric `productCount` and `totalStock` values.
- Backend creates categories with the logged-in user's `user_id`.
- Backend update and delete reject missing or unauthorized category IDs.
