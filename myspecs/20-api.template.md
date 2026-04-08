# API Specification

## Auth
POST /auth/login  
POST /auth/logout  

## Users
GET /users  
POST /users  

## Categories
GET /categories  
POST /categories  
PUT /categories/:id  
DELETE /categories/:id  

## Products
GET /products  
POST /products  
PUT /products/:id  
DELETE /products/:id  
GET /products/category/:categoryId  

## Sales
POST /sales  
GET /sales  
GET /sales/:id  

## Utang
POST /utang  
GET /utang  
POST /utang/payment  

## Suppliers
POST /suppliers  
GET /suppliers  

## Purchases
POST /purchases  
GET /purchases  

## Expenses
POST /expenses  
GET /expenses  

## Reports
GET /reports/sales  
GET /reports/inventory  
GET /reports/profit  