# Page Spec: Utang

## Feature Name
Utang Management

## Purpose
Track customer debts, itemized borrowed products, payment status, and debt record maintenance.

## Database Note
Utang records and their item details are stored in the system database. Create, update, toggle, and delete actions must persist correctly in the backend database.

## User Story
As a store owner, I want to record and update customer utang so I can monitor unpaid balances accurately.

## Current Route
`/utang`

## UI Sections
- Sidebar navigation
- Page header
- Add utang button
- Utang table
- Add/Edit utang modal

## Functional Requirements
- Load all utang records.
- Load available products for item selection.
- Allow creating a new utang record for a customer.
- Allow adding multiple product items into one utang entry.
- Compute total debt from item subtotals.
- Allow editing an existing utang record.
- Allow toggling utang status between paid and unpaid.
- Allow deleting an utang record.
- Allow logout from the sidebar.

## API Dependencies
- `GET /utang`
- `POST /utang`
- `PUT /utang/:id`
- `PATCH /utang/:id/toggle`
- `DELETE /utang/:id`
- `GET /products`

## Request Payload
```json
{
  "name": "Customer Name",
  "items": [
    {
      "product_id": 1,
      "product_name": "Item",
      "quantity": 2,
      "price": 10,
      "subtotal": 20
    }
  ]
}
```

## Business Rules
- `totalDebt = sum(item.subtotal)`
- Each item subtotal is `price * quantity`.
- A utang record requires a customer name and at least one item.
- Status toggle flips between `PAID` and `UNPAID`.

## Validation Rules
- Customer name is required.
- Selected product must exist.
- Quantity must be greater than zero.
- Save action should not proceed with an empty item list.

## Edge Cases
- Duplicate products added to the same utang
- Product deleted after old utang records exist
- Empty utang list
- Backend stock logic when utang is created or updated

## Acceptance Criteria
- User can create, edit, toggle, and delete utang entries.
- Modal shows current items and computed total before save.
- Table clearly shows customer, items, total debt, and status.
