Here is a **complete System Specification and Features** for a:

# 🏪 Inventory Management System for Sari-Sari Store

---

# 1️⃣ System Overview

The **Sari-Sari Store Inventory Management System (SSIMS)** is a computerized system designed to manage small retail stores commonly found in the Philippines.

Sari-sari stores sell:

* Snacks
* Soft drinks
* Canned goods
* Rice
* Coffee
* Cigarettes
* Toiletries
* Load (mobile credits)
* Household essentials

The system helps store owners:

* Monitor daily sales
* Track inventory
* Manage supplier purchases
* Record expenses
* Monitor monthly and yearly profit

---

# 2️⃣ Objectives

* Replace manual notebook recording
* Track fast-moving items
* Prevent out-of-stock situations
* Monitor monthly expenses and profit
* Improve store decision-making

---

# 3️⃣ Target Users

1. **Store Owner (Admin)**
2. **Cashier / Store Staff**

---

# 4️⃣ Functional Requirements (System Features)

---

## 🔐 A. User Management Module

* Login (Username & Password)
* Role-based access:

  * Admin
  * Cashier
* Change password
* Logout

---

## 📦 B. Product Management Module

### Add Product

* Product name
* Category
* Cost price
* Selling price
* Quantity
* Reorder level
* Barcode (optional)
* Supplier

### Edit Product

### Delete Product

### Search Product

### Filter by category

---

## 🗂 C. Category Management

Common sari-sari categories:

* Beverages
* Snacks
* Canned Goods
* Instant Noodles
* Rice
* Coffee & Sugar
* Toiletries
* Cigarettes
* Frozen Goods
* Mobile Load

Admin can:

* Add category
* Edit category
* Delete category

---

## 📊 D. Inventory Monitoring

* Real-time stock tracking
* Low stock alert
* Out-of-stock notification
* Automatic stock deduction after sale
* Stock adjustment (damaged, expired items)
* View stock history

---

## 💰 E. Sales Management

* Create sales transaction
* Add multiple items to cart
* Compute total automatically
* Accept payment
* Display change
* Print receipt (optional)
* View:

  * Daily sales
  * Weekly sales
  * Monthly sales
  * Yearly sales

---

## 📒 F. Utang (Credit) Management ⭐ (Important Feature)

Since many sari-sari stores allow credit:

* Record customer name
* Add items to utang
* Track total balance
* Record partial payments
* View unpaid balances
* Notify overdue accounts

---

## 🚚 G. Supplier & Purchase Management

* Add supplier
* Record purchase date
* Record items purchased
* Record total purchase cost
* Update stock automatically after restocking
* View purchase history

---

## 💸 H. Expense Tracking

Record expenses such as:

* Electricity
* Water
* Rent
* Internet
* Restocking
* Miscellaneous

System calculates:

* Monthly total expenses
* Yearly total expenses
* Net profit (Sales – Expenses)

---

## 📈 I. Reports Module

Generate reports:

* Inventory report
* Low stock report
* Daily sales report
* Monthly sales report
* Expense report
* Profit report
* Utang report

Reports can be:

* Printable
* Exportable (PDF/Excel)

---

## 📊 J. Dashboard Overview

The dashboard shows:

* Total Sales Today
* Monthly Revenue
* Monthly Expenses
* Current Profit
* Low Stock Items
* Total Utang
* Best-Selling Products

---

# 5️⃣ Non-Functional Requirements

## 🔒 Security

* Encrypted passwords
* Role-based permissions
* Secure login

## ⚡ Performance

* Fast item search
* Quick checkout system

## 💾 Backup

* Manual backup
* Automatic daily backup

## 📱 Accessibility

* Web-based system
* Mobile-friendly
* Can run on low-spec computers

---

# 6️⃣ System Architecture Example

### Frontend

* React / HTML CSS JS

### Backend

* Node.js / NestJS / PHP / Laravel

### Database

* MySQL / PostgreSQL

---

# 7️⃣ Sample Database Tables

### Users

* user_id
* username
* password
* role

### Products

* product_id
* name
* category_id
* cost_price
* selling_price
* quantity
* reorder_level

### Sales

* sale_id
* date
* total_amount
* user_id

### Sale_Items

* sale_item_id
* sale_id
* product_id
* quantity
* price

### Utang

* utang_id
* customer_name
* total_balance
* date

### Expenses

* expense_id
* description
* amount
* date

### Suppliers

* supplier_id
* name
* contact

---

# 8️⃣ Advanced Features (For Higher Grade / Capstone)

* 📱 SMS reminder for utang
* 📊 Sales prediction analytics
* 📷 Barcode scanner integration
* 🧾 E-receipt via SMS
* 📦 Expiration date tracking
* 🌐 Cloud backup system
* 🛍 Mobile app version
* 💳 GCash / digital payment integration

---

# 9️⃣ Scope and Limitation (Example)

### Scope:

* Inventory tracking
* Sales recording
* Expense monitoring
* Utang tracking
* Supplier management

### Limitation:

* For single-branch store only
* Requires internet for cloud backup
* Does not include advanced accounting features

---

# 🔟 Suggested System Titles

* SmartSari Inventory System
* TindahanPro Management System
* SariStock Manager
* UtangTrack Inventory System
* Tindahan360 Management System

---

If you want next, I can give you:

* ✅ ER Diagram explanation
* ✅ Use Case Diagram
* ✅ Capstone documentation format
* ✅ 6-member feature distribution
* ✅ System flowchart
* ✅ Sample defense script

Tell me what you need next 😊
