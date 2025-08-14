# eCommerce API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Products](#products)
- [Orders](#orders)
- [Categories & Attributes](#categories--attributes)
- [Tax Rules](#tax-rules)
- [Shipping Methods](#shipping-methods)
- [Coupons](#coupons)

## Authentication

All protected routes require a valid authentication token in the Authorization header:
```
Authorization: Bearer <token>
```

## Products

### Get All Products
```http
GET /api/products
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort field (default: "-createdAt")
- `category`: Filter by category ID
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `search`: Search in name and description
- `type`: Filter by product type ("simple" or "variable")
- `stockStatus`: Filter by stock status

Response:
```json
{
  "products": [{
    "name": "Product Name",
    "slug": "product-name",
    "description": "Product description",
    "price": 99.99,
    "regularPrice": 129.99,
    "salePrice": 99.99,
    "images": ["url1", "url2"],
    "categories": [{
      "name": "Category",
      "slug": "category"
    }],
    "stockStatus": "instock",
    "type": "simple"
  }],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

### Get Product by ID
```http
GET /api/products/:id
```

Response includes product details and variations if it's a variable product.

### Get Product by Slug
```http
GET /api/products/slug/:slug
```

### Create Product
```http
POST /api/products
```
Protected Route

Request Body:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "regularPrice": 129.99,
  "salePrice": 99.99,
  "categories": ["categoryId1", "categoryId2"],
  "type": "simple",
  "attributes": [{
    "name": "Size",
    "values": ["S", "M", "L"],
    "isVariationAttribute": true
  }]
}
```

### Update Product
```http
PUT /api/products/:id
```
Protected Route

### Delete Product
```http
DELETE /api/products/:id
```
Protected Route

### Product Variations

#### Get Product Variations
```http
GET /api/products/:id/variations
```

#### Create Variation
```http
POST /api/products/:id/variations
```
Protected Route

Request Body:
```json
{
  "sku": "PROD-VAR-1",
  "price": 99.99,
  "stock": 100,
  "attributeValues": [{
    "name": "Size",
    "value": "M"
  }]
}
```

#### Update Variation
```http
PUT /api/products/:id/variations/:variationId
```
Protected Route

#### Delete Variation
```http
DELETE /api/products/:id/variations/:variationId
```
Protected Route

### Upload Product Image
```http
POST /api/products/upload-image
```
Protected Route

Request: Multipart form data with image file(s)

## Orders

### Create Order
```http
POST /api/orders
```
Protected Route

Request Body:
```json
{
  "items": [{
    "product": "productId",
    "variation": "variationId",
    "quantity": 2
  }],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Street",
    "city": "City",
    "state": "State",
    "postcode": "12345",
    "country": "Country",
    "email": "email@example.com",
    "phone": "1234567890"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Street",
    "city": "City",
    "state": "State",
    "postcode": "12345",
    "country": "Country",
    "email": "email@example.com",
    "phone": "1234567890"
  },
  "shippingMethod": "shippingMethodId",
  "paymentMethod": "card",
  "couponCode": "DISCOUNT10"
}
```

### Get My Orders
```http
GET /api/orders
```
Protected Route

Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status`: Filter by order status

### Get All Orders (Admin)
```http
GET /api/orders/all
```
Protected Route (Admin only)

### Get Order by ID
```http
GET /api/orders/:id
```
Protected Route

### Update Order Status
```http
PUT /api/orders/:id/status
```
Protected Route (Admin only)

Request Body:
```json
{
  "status": "processing",
  "note": "Order is being processed"
}
```

### Add Tracking Information
```http
POST /api/orders/:id/tracking
```
Protected Route (Admin only)

Request Body:
```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890",
  "carrier": "UPS",
  "note": "Package shipped",
  "estimatedDelivery": "2024-03-20T15:00:00Z"
}
```

## Categories & Attributes

### Get All Categories
```http
GET /api/categories
```

Query Parameters:
- `flat` (optional): Return flat structure instead of tree

### Get Category Tree
```http
GET /api/categories/tree
```

### Create Category
```http
POST /api/categories
```
Protected Route

Request Body:
```json
{
  "name": "Category Name",
  "description": "Category description",
  "parent": "parentCategoryId"
}
```

### Get/Update/Delete Category
```http
GET/PUT/DELETE /api/categories/:id
```

### Attributes

#### Get All Attributes
```http
GET /api/categories/attributes
```

#### Create Attribute
```http
POST /api/categories/attributes
```
Protected Route

Request Body:
```json
{
  "name": "Size",
  "type": "select",
  "values": [{
    "name": "Small",
    "slug": "small"
  }, {
    "name": "Medium",
    "slug": "medium"
  }]
}
```

## Tax Rules

### Get All Tax Rules
```http
GET /api/tax
```

Query Parameters:
- `country`: Filter by country
- `state`: Filter by state

### Create Tax Rule
```http
POST /api/tax
```
Protected Route

Request Body:
```json
{
  "name": "VAT",
  "country": "GB",
  "rate": 20,
  "isDefault": false
}
```

### Calculate Tax
```http
POST /api/tax/calculate
```

Request Body:
```json
{
  "amount": 99.99,
  "country": "GB",
  "state": "London",
  "includesTax": false
}
```

## Shipping Methods

### Get All Methods
```http
GET /api/shipping
```

### Create Method
```http
POST /api/shipping
```
Protected Route

Request Body:
```json
{
  "name": "Standard Shipping",
  "price": 9.99,
  "estimatedDelivery": {
    "min": 3,
    "max": 5
  },
  "countries": ["US", "CA"]
}
```

### Calculate Shipping
```http
POST /api/shipping/calculate
```

Request Body:
```json
{
  "methodId": "shippingMethodId",
  "orderAmount": 99.99,
  "country": "US"
}
```

### Get Available Methods
```http
POST /api/shipping/available
```

Request Body:
```json
{
  "country": "US",
  "orderAmount": 99.99
}
```

## Coupons

### Get All Coupons
```http
GET /api/coupons
```
Protected Route

Query Parameters:
- `page`: Page number
- `limit`: Items per page
- `active`: Filter active/inactive coupons
- `expired`: Filter expired/non-expired coupons

### Create Coupon
```http
POST /api/coupons
```
Protected Route

Request Body:
```json
{
  "code": "DISCOUNT10",
  "discountType": "percentage",
  "discountValue": 10,
  "minAmount": 50,
  "expiresAt": "2024-12-31T23:59:59Z",
  "usageLimit": 100
}
```

### Validate Coupon
```http
POST /api/coupons/validate
```

Request Body:
```json
{
  "code": "DISCOUNT10",
  "amount": 99.99,
  "products": ["productId1", "productId2"],
  "categories": ["categoryId1"]
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 30 requests per minute for unauthenticated users

## Pagination

Most list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```