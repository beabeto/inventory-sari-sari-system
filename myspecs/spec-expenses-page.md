# Page Spec: Expenses

## Feature Name
Expense Tracking

## Purpose
Allow users to record operating expenses, filter them by date, and compare expenses against current sales.

## User Story
As a store owner, I want to track daily expenses so I can see how they affect profit.

## Current Route
`/expenses`

## UI Sections
- Sidebar navigation
- Page header
- Summary cards
- Add expense form
- Date filter
- Expenses table

## Functional Requirements
- Load expenses for the selected date or all available expenses when no date is selected.
- Load today sales for comparison.
- Show total expenses.
- Show sales today.
- Show profit using `salesToday - totalExpenses`.
- Allow adding a new expense.
- Allow deleting an expense with confirmation.
- Split stored expense `name` into category and description for display.
- Allow logout from the sidebar.

## API Dependencies
- `GET /expenses?date=YYYY-MM-DD`
- `POST /expenses`
- `DELETE /expenses/:id`
- `GET /sales/today`

## Request Payload
```json
{
  "name": "Category - Description",
  "amount": 100,
  "date": "YYYY-MM-DD"
}
```

## Business Rules
- Category dropdown is currently fixed in the frontend.
- Description is optional.
- If no date is selected while adding, use today’s date.
- Profit may be negative when expenses exceed sales.

## Validation Rules
- Category is required.
- Amount must be greater than zero.
- Date must be valid when supplied.

## Edge Cases
- No expenses found for selected date
- Sales API unavailable while expenses still load
- Expense name has no ` - ` separator
- Negative profit

## Acceptance Criteria
- New expenses appear in the table after creation.
- Date filter updates the displayed expenses.
- Summary cards update consistently with the filtered list and today sales.
- Delete removes the selected expense after confirmation.
