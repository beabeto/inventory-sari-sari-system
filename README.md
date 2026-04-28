
# Sari-Sari Store Inventory Management System
This project is a full-stack inventory management system for a sari-sari store.

The frontend is built with React + TypeScript + Vite, and the backend is built with NestJS + TypeORM + MySQL.

The system is designed to help manage:
- user login and authentication
- categories
- products and stock
- sales transactions
- utang or customer debt
- expenses
- dashboard analytics
- account settings

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Recharts

### Backend
- NestJS
- TypeORM
- MySQL
- JWT authentication

## Project Structure

```text
inventory-sari-sari-system/
|-- frontend/
|   |-- sari-sari-frontend/
|-- backend/
|   |-- sari-sari-backend/
|-- myspecs/
```

## Prerequisites

Before running the project, install these first:

- Node.js 18 or later
- npm
- MySQL Server

## Database Setup

The backend is currently configured in `backend/sari-sari-backend/src/app.module.ts` to connect to this MySQL database:

```ts
host: 'localhost'
port: 3306
username: 'beto'
password: 'beto2004'
database: 'sari_sari_db'
```

Create the database first in MySQL:

```sql
CREATE DATABASE sari_sari_db;
```

Then make sure the MySQL username and password above match your local MySQL account.

Note:
- The backend currently uses `synchronize: true`, so TypeORM will create/update tables automatically during development.
- If your MySQL credentials are different, update `src/app.module.ts` before starting the backend.

## Installation

Install dependencies separately for the frontend and backend.

### 1. Install frontend dependencies

```powershell
cd inventory-sari-sari-system\frontend\sari-sari-frontend
npm install
```

### 2. Install backend dependencies

```powershell
cd inventory-sari-sari-system\backend\sari-sari-backend
npm install
```

## How To Run The Project

You need to run the backend and frontend in separate terminals.

### Run the backend

```powershell
cd inventory-sari-sari-system\backend\sari-sari-backend
npm run start:dev
```

Backend default URL:

```text
http://localhost:3000
```

### Run the frontend

```powershell
cd inventory-sari-sari-system\frontend\sari-sari-frontend
npm run dev
```

Frontend default URL with Vite is usually:

```text
http://localhost:5173
```

## How To Compile / Build

### Build the frontend

```powershell
cd inventory-sari-sari-system\frontend\sari-sari-frontend
npm run build
```

This compiles the React + TypeScript frontend for production.

### Build the backend

The backend package currently has runtime scripts like `start` and `start:dev`, but no dedicated `build` script is defined yet in `backend/sari-sari-backend/package.json`.

If you want a backend build command, you can add:

```json
"build": "nest build"
```

Then run:

```powershell
npm run build
```

## Seed Default Login User

There is a seed file in the backend:

```text
backend/sari-sari-backend/src/seed-user.ts
```

It creates this default account if it does not already exist:

```text
username: admin
password: admin123
```

To run the seed manually:

```powershell
cd inventory-sari-sari-system\backend\sari-sari-backend
npx ts-node src/seed-user.ts
```

## Current Routes

### Frontend routes
- `/login`
- `/dashboard`
- `/categories`
- `/products`
- `/sales`
- `/utang`
- `/expenses`
- `/account`

### Main backend API routes
- `POST /auth/login`
- `GET /dashboard`
- `GET /dashboard/recent-today`
- `GET /dashboard/weekly`
- `GET /dashboard/monthly`
- `GET /dashboard/yearly`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `GET /products`
- `GET /products/low-stock`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /sales/today`
- `POST /sales/today`
- `GET /sales/history/daily`
- `GET /sales/history/weekly`
- `GET /sales/history/monthly`
- `GET /sales/history/yearly`
- `GET /utang`
- `POST /utang`
- `PUT /utang/:id`
- `PATCH /utang/:id/toggle`
- `DELETE /utang/:id`
- `GET /expenses`
- `POST /expenses`
- `DELETE /expenses/:id`
- `GET /users/me`
- `PUT /users/update-profile`
- `PUT /users/change-password`

## Feature Overview

Below is the development flow of the system and the intended purpose of each page.

### 1. Login Page

The login page is the entry point of the system. It allows store staff such as the owner or cashier to sign in using a username and password. When login succeeds, the backend returns a JWT access token, and the frontend stores it in `localStorage`. This token is then used to access protected pages.

Main features:
- username and password form
- backend authentication through `POST /auth/login`
- token storage in browser `localStorage`
- redirect to dashboard after successful login
- basic protection for private pages

### 2. Categories Page

The categories page helps organize products into groups such as beverages, canned goods, snacks, toiletries, and other store sections. This makes inventory easier to browse and manage.

Main features:
- load and display all categories
- add a new category
- edit category names
- delete categories
- search categories by name
- show product count per category
- show total stock count per category

Why this matters:
- keeps the inventory structured
- makes reporting and filtering easier
- prevents products from becoming disorganized

### 3. Products Page

The products page is the main inventory management area. This is where store items are created, updated, viewed, filtered, and removed.

Main features:
- load all products from the backend
- filter products by category
- search products by name
- add new products
- edit product details
- delete products
- display price, stock, category, and total inventory value
- show summary information based on loaded products

Why this matters:
- keeps item records accurate
- helps track current stock levels
- supports sales, dashboard, and low-stock monitoring

### 4. Sales Page

The sales page records store transactions and shows sales performance in multiple time views. It acts as both a cashier transaction page and a reporting page.

Main features:
- load available products for selling
- record a sale by product and quantity
- automatically refresh totals after each sale
- show today's total sales
- show low-stock item count
- display sales history
- support daily, weekly, monthly, and yearly views
- visualize sales trends using charts

Why this matters:
- tracks store income
- updates stock movement through sales
- helps the owner understand selling patterns over time

### 5. Utang Page

The utang page is for managing customer debts, which is very common in many sari-sari stores. It helps track who owes money, which products were borrowed, how much is owed, and whether the debt has been paid.

Main features:
- create an utang record for a customer
- add multiple items inside one utang entry
- calculate total debt from item subtotals
- edit existing utang records
- mark utang as paid or unpaid
- delete utang entries
- display debt records in a clear table

Why this matters:
- gives visibility into unpaid balances
- helps reduce forgotten debts
- supports store cash flow awareness

### 6. Expenses Page

The expenses page records daily operating costs such as transportation, electricity, supplies, and other spending. It also compares expenses against current sales.

Main features:
- add a new expense entry
- assign category and description
- filter expenses by date
- delete expense records
- show total expenses
- show sales today
- calculate simple profit as `sales today - expenses`

Why this matters:
- helps monitor outgoing money
- makes profit more visible
- supports better financial decisions

### 7. Dashboard Page

The dashboard is the overview page of the whole system. It summarizes key store metrics in one place so the owner or cashier can quickly understand daily performance.

Main features:
- total products
- total categories
- low-stock count
- sales today
- expenses today
- profit today
- total utang
- recent sales list
- low-stock products list
- chart analytics for today, weekly, monthly, and yearly views
- auto-refresh for near real-time monitoring

Why this matters:
- gives a quick snapshot of store status
- highlights urgent inventory issues
- helps monitor earnings and operational activity

### 8. Account Settings Page

The account settings page lets the logged-in user manage account information and security.

Main features:
- update username
- change password
- update and save a profile image URL
- pick a profile image file from the device and save it
- display the saved profile image in the sidebar on authenticated pages
- send authenticated requests with Bearer token
- show success and error feedback
- clear form after successful update

Why this matters:
- improves account security
- lets the user maintain their own profile
- supports safer long-term use of the system

## Current Small Feature Spec

For the current software engineering exercise, the selected small feature is:

- `Profile Image In Sidebar And Account Settings`

Spec file:

- `myspecs/spec-profile-image-sidebar.md`

Requirement IDs:

- `SSIMS-PROFILE-001`
- `SSIMS-PROFILE-002`
- `SSIMS-PROFILE-003`
- `SSIMS-PROFILE-004`
- `SSIMS-PROFILE-005`
- `SSIMS-PROFILE-006`

Feature summary:

- show a profile image on every authenticated page sidebar
- allow the image to be picked in Account Settings
- persist the image through the backend user profile
- show a fallback avatar state when no image is saved

Implementation status:

- backend user profile now supports `profileImage`
- `GET /users/me` returns the current profile image
- `PUT /users/update-profile` accepts profile image updates
- all authenticated page sidebars now use the shared profile display

## Spec-First Workflow For This Feature

Follow this order for the exercise:

1. Draft and review the spec in `myspecs/spec-profile-image-sidebar.md`
2. Mark the spec accepted before implementation
3. Add tests that reference the requirement IDs
4. Implement the backend and frontend changes
5. Run verification commands
6. Review the diff before committing
7. Open a PR that references the spec path and requirement IDs

## Git Workflow Commands

Use these commands as a copy-paste starting point for the exercise:

```powershell
cd inventory-sari-sari-system
git status
git checkout main
git pull origin main
git checkout -b feat/profile-image-sidebar
```

After you review the spec and start implementation:

```powershell
git status
git add myspecs/spec-profile-image-sidebar.md README.md
git commit -m "docs: add accepted spec for sidebar profile image"
```

After code and tests are finished:

```powershell
cd backend\sari-sari-backend
npm test

cd ..\..\frontend\sari-sari-frontend
npm test

cd ..\..
git status
git diff
git add .
git commit -m "feat: add sidebar profile image support"
git push -u origin feat/profile-image-sidebar
```

Suggested PR references:

- Spec: `myspecs/spec-profile-image-sidebar.md`
- Requirements: `SSIMS-PROFILE-001` to `SSIMS-PROFILE-006`

## Suggested Development Order

Your chosen development order is strong because it follows the actual flow of store operations:

1. Login
2. Category
3. Products
4. Sales
5. Utang
6. Expenses
7. Dashboard
8. Account Settings

This order makes sense because:
- login secures the app first
- categories come before products because products depend on them
- products come before sales because sales need inventory
- utang and expenses extend the financial side of the system
- dashboard is best built after core data pages already exist
- account settings can be added after authentication is working

## Testing

### Frontend

```powershell
cd inventory-sari-sari-system\frontend\sari-sari-frontend
npm test
```

### Backend

```powershell
cd inventory-sari-sari-system\backend\sari-sari-backend
npm test
```

## Notes

- The frontend authentication API is currently pointing to `http://localhost:3000`.
- CORS is enabled in the NestJS backend.
- Protected frontend pages depend on a stored JWT token.
- Some package files also exist in parent `frontend/` and `backend/` folders, but the main app code runs from `frontend/sari-sari-frontend` and `backend/sari-sari-backend`.

## Future Improvements

Possible next improvements for this project:

- move database credentials into environment variables
- add proper backend `build`, `lint`, and `start:prod` scripts
- add role-based access for admin and cashier
- improve validation and error messages
- add inventory alerts and notifications
- add printable reports
- add better audit logs for sales, expenses, and utang

## Author Notes

This system is built step by step around real sari-sari store workflows. The goal is not only to store data, but to support daily operations such as login, organizing products, recording sales, tracking utang, monitoring expenses, and reviewing dashboard analytics in one place.
