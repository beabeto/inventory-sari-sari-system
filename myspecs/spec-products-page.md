# Page Spec: Products

## Feature Name
Product Management

## Purpose
Allow users to manage inventory items, view stock and value, and filter products by category.

## Database Note
Product and category data are stored in the system database. All product CRUD actions must persist changes in the database and reflect current inventory values.

## User Story
As a store user, I want to add, update, delete, search, and filter products so that inventory stays accurate and manageable.

## Current Route
`/products`

## UI Sections
- Sidebar navigation
- Header with stock and inventory value summary
- Add product button
- Category filter dropdown
- Search input
- Products table
- Add/Edit modal
- Delete confirmation modal

## Functional Requirements
- Load all categories on page open.
- Load all products on page open.
- Filter products by selected category.
- Search products by name.
- Show product name, category, price, stock, and total value.
- Allow adding a product.
- Allow editing a product.
- Allow deleting a product.
- Refresh product list after every successful create, update, or delete action.
- Allow logout from the sidebar.

## API Dependencies
- `GET /categories`
- `GET /products`
- `GET /products?category_id=:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Request Payload
```json
{
  "name": "string",
  "price": 0,
  "stock": 0,
  "category_id": 1
}
```

## Business Rules
- `total value = price * stock`
- Product must belong to a valid category.
- Category filter affects the product list only.
- Summary cards use the currently loaded products list.

## Validation Rules
- Product name is required.
- Category is required.
- Price should be zero or greater.
- Stock should be zero or greater.

## Edge Cases
- Product category no longer exists
- No products found for selected category
- Empty search results
- Backend rejects invalid product data

## Acceptance Criteria
- Product list loads correctly.
- Category filter narrows the table.
- Search filters visible products by name.
- Create, edit, and delete all update the list successfully.
