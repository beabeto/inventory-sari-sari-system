Perfect 👍 let’s make a **clean mini-spec** first (this is exactly what your prof wants).

---

# 🧠 MINI SPEC — Category Stock & Product Count Feature

---

## 📌 Feature Name:

**Category Summary Display (Product Count & Stock Count)**

---

## 🎯 Description:

The system will display additional information for each category, showing how many products belong to that category and/or the total stock quantity of those products.

This helps the store owner quickly understand inventory distribution per category.

---

## 👤 User Story:

> As a store owner, I want to see how many products and total stock each category has so that I can easily monitor inventory levels.

---

## 🔄 User Flow:

```text
Open Categories Page → View Categories List → See product count / stock per category → Click category → Redirect to filtered products
```

---

## ✅ Expected Behavior:

1. Each category displays the number of products it contains
2. Each category optionally displays total stock quantity
3. Data is fetched from backend dynamically
4. When a category is clicked, it redirects to filtered products page
5. Counts update automatically when products are added/edited/deleted

---

## 📊 Example UI:

```text
Snacks        (5 products • 120 stocks)
Drinks        (3 products • 80 stocks)
Coffee        (2 products • 50 stocks)
```

---

## 🔧 Functional Requirements:

### Backend:

* System must count products grouped by category
* System must sum stock values per category
* API must return:

```json
{
  "category_id": 1,
  "name": "Snacks",
  "productCount": 5,
  "totalStock": 120
}
```

---

### Frontend:

* Display category name
* Display product count
* Display total stock
* Make category clickable
* Redirect to:

```text
/products?category_id=1
```

---

## 🗄 Database Requirements:

### Tables Used:

* `categories`
* `products`

### Relationship:

```text
categories.category_id → products.category_id
```

---

## ⚡ Non-Functional Requirements:

* Fast loading of category data
* Real-time updates after product changes
* Clean and readable UI (dashboard style)

---

## 🚫 Limitations:

* Only counts products within the same database
* Does not include expired/damaged filtering (future feature)

---

## 🚀 Future Enhancements:

* Show low-stock warning per category
* Show best-selling category
* Add category analytics (charts)

---

# ✅ DONE (Spec Ready)

---

Now send me your:

👉 Categories **frontend code**
👉 Categories **backend (service + controller)**

Then I will:

✅ Fix your current code
✅ Add **product count + stock count properly**
✅ Connect everything correctly (no errors)

Let’s continue 🔥
