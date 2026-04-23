# Page Spec: Dashboard

## Feature Name
Dashboard Overview

## Purpose
Show a quick real-time overview of store performance, alerts, and recent activity.

## User Story
As a store owner or cashier, I want to see the most important store metrics in one page so I can monitor daily operations quickly.

## Current Route
`/dashboard`

## UI Sections
- Sidebar navigation
- Dashboard header with current date
- Summary cards
- Sales analytics chart
- Recent sales today list
- Low stock products list

## Functional Requirements
- Display total products.
- Display total categories.
- Display low stock count.
- Display sales today.
- Display expenses today.
- Display profit today.
- Display sales analytics in `today`, `weekly`, and `monthly` modes.
- Display recent sales for the current day.
- Display low stock products.
- Auto-refresh dashboard data every 8 seconds.
- Allow logout from the sidebar.

## API Dependencies
- `GET /dashboard`
- `GET /products/low-stock`
- `GET /dashboard/recent-today`
- `GET /dashboard/weekly`
- `GET /dashboard/monthly`

## Expected Dashboard Data
- `totalProducts`
- `totalCategories`
- `lowStock`
- `salesToday`
- `expensesToday`
- `profitToday`
- `totalUtang`

## Business Rules
- `profitToday = salesToday - expensesToday`
- Weekly chart uses sales totals per weekday.
- Monthly chart uses sales totals per month.
- Empty recent sales should show `No sales today`.

## Edge Cases
- API returns missing or string values for numbers
- No sales today
- No low stock items
- One or more dashboard API calls fail

## Acceptance Criteria
- All summary cards show numeric values without breaking the UI.
- Chart mode buttons switch the graph data correctly.
- Recent sales list shows latest sales or an empty state.
- Low stock list highlights products that need attention.
