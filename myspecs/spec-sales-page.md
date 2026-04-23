# Page Spec: Sales

## Feature Name
Sales Dashboard and Transaction Entry

## Purpose
Allow users to record sales and view sales history across daily, weekly, monthly, and yearly modes.

## Database Note
Sales transactions are stored in the system database. Saving a sale must create a persistent sales record and update related product stock in the database.

## User Story
As a cashier or owner, I want to record product sales and review sales history so I can monitor store performance over time.

## Current Route
`/sales`

## UI Sections
- Sidebar navigation
- Sales header and live Philippines time display
- History mode buttons
- Add sale button
- Summary cards
- Sales bar chart
- Add sale modal

## Functional Requirements
- Load available products.
- Load total sales for today.
- Load sales history based on selected mode.
- Support history modes: `daily`, `weekly`, `monthly`, `yearly`.
- Allow adding a sale by selecting a product and quantity.
- Refresh products, today sales, and history after saving a sale.
- Show low stock count based on product stock less than or equal to 5.
- Allow logout from the sidebar.

## API Dependencies
- `GET /products`
- `GET /sales/today`
- `POST /sales/today`
- `GET /sales/history/daily?date=YYYY-MM-DD`
- `GET /sales/history/weekly`
- `GET /sales/history/monthly?year=YYYY`
- `GET /sales/history/yearly`

## Request Payload
```json
{
  "product_id": 1,
  "quantity": 1
}
```

## Business Rules
- Sales total is based on backend-calculated daily totals.
- Profit card currently uses a simplified estimate: `totalSales * 0.3`.
- Quantity must be greater than zero.
- Product stock should be updated by the backend after a sale is recorded.

## Validation Rules
- Product selection is required.
- Quantity must be a positive number.

## Edge Cases
- No products available
- No sales data for selected mode
- Sale request exceeds available stock
- Backend unavailable during save

## Acceptance Criteria
- Switching modes reloads chart data correctly.
- Adding a sale updates summary values and history.
- Daily mode uses the current date automatically.
- Sales page remains usable even when history data is empty.
