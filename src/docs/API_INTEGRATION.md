# eCommerce API Integration Documentation

This document describes how to use the frontend services and utilities that integrate with the eCommerce backend API.

## Table of Contents
- [Authentication](#authentication)
- [Services Overview](#services-overview)
- [Products](#products)
- [Orders](#orders)
- [Categories & Attributes](#categories--attributes)
- [Tax Rules](#tax-rules)
- [Shipping Methods](#shipping-methods)
- [Coupons](#coupons)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Pagination](#pagination)

## Authentication

All protected routes require a valid authentication token in the Authorization header. The token is automatically added by the request interceptor.

```javascript
import { useAuth } from 'src/auth/context/jwt';

const { user, isAuthenticated } = useAuth();
```

## Services Overview

The application uses service classes to interact with the API. Each service handles a specific domain:

- `ProductService` - Product management
- `OrderService` - Order management
- `CategoryService` - Category management
- `AttributeService` - Product attributes
- `TaxService` - Tax rules and calculations
- `ShippingService` - Shipping methods
- `CouponService` - Coupon management
- `UserService` - User management

## Products

### ProductService

```javascript
import ProductService from 'src/services/products/products.service';

// Get all products with pagination and filters
const products = await ProductService.getAll({
  page: 1,
  limit: 10,
  category: 'categoryId',
  minPrice: 10,
  maxPrice: 100,
  search: 'search term',
  type: 'simple',
  stockStatus: 'instock'
});

// Get product by ID
const product = await ProductService.getById('productId');

// Get product by slug
const product = await ProductService.getBySlug('product-slug');

// Create product
const newProduct = await ProductService.create({
  name: 'Product Name',
  description: 'Product description',
  price: 99.99,
  regularPrice: 129.99,
  salePrice: 99.99,
  categories: ['categoryId1', 'categoryId2'],
  type: 'simple',
  attributes: [{
    name: 'Size',
    values: ['S', 'M', 'L'],
    isVariationAttribute: true
  }]
});

// Update product
const updatedProduct = await ProductService.update('productId', {
  name: 'Updated Product Name'
});

// Delete product
await ProductService.delete('productId');

// Product variations
const variations = await ProductService.getVariations('productId');

const newVariation = await ProductService.createVariation('productId', {
  sku: 'PROD-VAR-1',
  price: 99.99,
  stock: 100,
  attributeValues: [{
    name: 'Size',
    value: 'M'
  }]
});

// Upload product image
const formData = new FormData();
formData.append('image', file);
const uploadResult = await ProductService.uploadImage(formData);
```

## Orders

### OrderService

```javascript
import OrderService from 'src/services/orders/orders.service';

// Create order
const order = await OrderService.create({
  items: [{
    product: 'productId',
    variation: 'variationId',
    quantity: 2
  }],
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Street',
    city: 'City',
    state: 'State',
    postcode: '12345',
    country: 'Country',
    email: 'email@example.com',
    phone: '1234567890'
  },
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Street',
    city: 'City',
    state: 'State',
    postcode: '12345',
    country: 'Country',
    email: 'email@example.com',
    phone: '1234567890'
  },
  shippingMethod: 'shippingMethodId',
  paymentMethod: 'card',
  couponCode: 'DISCOUNT10'
});

// Get user's orders
const myOrders = await OrderService.getMyOrders({
  page: 1,
  limit: 10,
  status: 'processing'
});

// Get all orders (admin only)
const allOrders = await OrderService.getAll({
  page: 1,
  limit: 20
});

// Get order by ID
const order = await OrderService.getById('orderId');

// Update order status (admin only)
await OrderService.updateStatus('orderId', {
  status: 'processing',
  note: 'Order is being processed'
});

// Add tracking information (admin only)
await OrderService.addTracking('orderId', {
  status: 'shipped',
  trackingNumber: '1Z999AA1234567890',
  carrier: 'UPS',
  note: 'Package shipped',
  estimatedDelivery: '2024-03-20T15:00:00Z'
});
```

## Categories & Attributes

### CategoryService

```javascript
import CategoryService from 'src/services/category/category.service';

// Get all categories (flat structure)
const categories = await CategoryService.getAll();

// Get category tree structure
const categoryTree = await CategoryService.getTree();

// Create category (admin only)
const newCategory = await CategoryService.add({
  name: 'Category Name',
  description: 'Category description',
  parent: 'parentCategoryId'
});

// Update category (admin only)
await CategoryService.update('categoryId', {
  name: 'Updated Category Name'
});

// Delete category (admin only)
await CategoryService.delete('categoryId');
```

### AttributeService

```javascript
import AttributeService from 'src/services/attribute/attribute.service';

// Get all attributes
const attributes = await AttributeService.getAll();

// Create attribute (admin only)
const newAttribute = await AttributeService.add({
  name: 'Size',
  type: 'select',
  values: [{
    name: 'Small',
    slug: 'small'
  }, {
    name: 'Medium',
    slug: 'medium'
  }]
});

// Update attribute (admin only)
await AttributeService.update('attributeId', {
  name: 'Updated Size'
});

// Delete attribute (admin only)
await AttributeService.delete('attributeId');
```

## Tax Rules

### TaxService

```javascript
import TaxService from 'src/services/tax/tax.service';

// Get all tax rules
const taxRules = await TaxService.getAll({
  country: 'GB',
  state: 'London'
});

// Create tax rule (admin only)
const newTaxRule = await TaxService.add({
  name: 'VAT',
  country: 'GB',
  rate: 20,
  isDefault: false
});

// Calculate tax
const taxCalculation = await TaxService.calculate({
  amount: 99.99,
  country: 'GB',
  state: 'London',
  includesTax: false
});
```

## Shipping Methods

### ShippingService

```javascript
import ShippingService from 'src/services/shipping/shipping.service';

// Get all shipping methods
const methods = await ShippingService.getAllMethods();

// Create shipping method (admin only)
const newMethod = await ShippingService.createMethod({
  name: 'Standard Shipping',
  price: 9.99,
  estimatedDelivery: {
    min: 3,
    max: 5
  },
  countries: ['US', 'CA']
});

// Calculate shipping
const shippingCost = await ShippingService.calculateShipping({
  methodId: 'shippingMethodId',
  orderAmount: 99.99,
  country: 'US'
});

// Get available methods
const availableMethods = await ShippingService.getAvailableMethods({
  country: 'US',
  orderAmount: 99.99
});
```

## Coupons

### CouponService

```javascript
import CouponService from 'src/services/coupons/coupons.service';

// Get all coupons (admin only)
const coupons = await CouponService.getAll({
  page: 1,
  limit: 20,
  active: true,
  expired: false
});

// Create coupon (admin only)
const newCoupon = await CouponService.add({
  code: 'DISCOUNT10',
  discountType: 'percentage',
  discountValue: 10,
  minAmount: 50,
  expiresAt: '2024-12-31T23:59:59Z',
  usageLimit: 100
});

// Validate coupon
const validation = await CouponService.validate({
  code: 'DISCOUNT10',
  amount: 99.99,
  products: ['productId1', 'productId2'],
  categories: ['categoryId1']
});
```

## Error Handling

The application includes comprehensive error handling utilities:

```javascript
import { 
  extractErrorMessage, 
  handleApiError, 
  isUnauthorized, 
  isForbidden 
} from 'src/utils/apiErrorHandler';

try {
  const result = await ProductService.getAll();
} catch (error) {
  // Basic error message extraction
  const message = extractErrorMessage(error);
  
  // Advanced error handling with callbacks
  const formattedError = handleApiError(error, {
    onUnauthorized: (error) => {
      // Handle 401 errors
      console.warn('User needs to login');
    },
    onForbidden: (error) => {
      // Handle 403 errors
      console.warn('User lacks permission');
    },
    onNotFound: (error) => {
      // Handle 404 errors
      console.warn('Resource not found');
    },
    onServerError: (error) => {
      // Handle 5xx errors
      console.error('Server error occurred');
    }
  });
  
  // Check specific error types
  if (isUnauthorized(error)) {
    // Handle unauthorized
  }
  
  if (isForbidden(error)) {
    // Handle forbidden
  }
}
```

## Rate Limiting

The application implements rate limiting according to the API specification:

```javascript
import rateLimiter from 'src/utils/rateLimiter';

// Check if request is allowed
const isAllowed = rateLimiter.isAllowed('userId', true); // true for authenticated

// Get remaining requests
const { remaining, resetTime } = rateLimiter.getRemaining('userId', true);

// Get rate limit headers
const headers = rateLimiter.getHeaders('userId', true);
```

## Pagination

Pagination utilities help handle the standard pagination format:

```javascript
import { 
  buildPaginationParams, 
  extractPagination, 
  createPaginationControls 
} from 'src/utils/pagination';

// Build pagination parameters
const params = buildPaginationParams({ page: 2, limit: 20 });

// Extract pagination from API response
const pagination = extractPagination(apiResponse);

// Create pagination controls for UI
const controls = createPaginationControls(pagination, 5);

// Validate pagination parameters
const { isValid, errors } = validatePagination({ page: 1, limit: 50 });
```

## Response Format

All API responses follow this standard format:

```javascript
// Success response
{
  "products": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}

// Error response
{
  "error": "Error message"
}
```

## HTTP Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Rate Limited
- 500: Internal Server Error

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks and use the error handling utilities.

2. **Pagination**: Use the pagination utilities for consistent pagination handling across the application.

3. **Rate Limiting**: The rate limiting is handled automatically, but be aware of the limits (100/min for authenticated, 30/min for unauthenticated).

4. **Authentication**: Check authentication status before making protected API calls.

5. **Loading States**: Implement loading states for better user experience during API calls.

6. **Validation**: Validate data before sending to the API to reduce errors.

## Examples

### Complete Product List with Pagination

```javascript
import { useState, useEffect } from 'react';
import ProductService from 'src/services/products/products.service';
import { buildPaginationParams, extractPagination } from 'src/utils/pagination';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = buildPaginationParams({ page, limit });
      const response = await ProductService.getAll(params);
      
      setProducts(response.products || []);
      setPagination(extractPagination(response));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (newPage) => {
    fetchProducts(newPage, pagination.limit);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Product list */}
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {/* Pagination controls */}
      <PaginationControls 
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
```

This integration provides a robust foundation for building eCommerce functionality that fully complies with the backend API specification.
