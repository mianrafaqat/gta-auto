# Address Book Implementation

## Overview

This implementation provides a complete address book system that works for both authenticated and non-authenticated users. It integrates with the existing checkout flow and provides a seamless user experience.

## Features

### For Authenticated Users
- **API Integration**: All addresses are stored in the backend via the Address Book API
- **Persistent Storage**: Addresses are permanently saved and accessible across devices
- **Full CRUD Operations**: Create, read, update, delete, and set primary addresses
- **Real-time Sync**: Changes are immediately reflected in the backend

### For Non-Authenticated Users
- **Local Storage**: Addresses are temporarily stored in the browser's localStorage
- **Session Persistence**: Addresses persist during the current browser session
- **Checkout Continuity**: Users can complete checkout without creating an account
- **Easy Migration**: Addresses can be saved permanently after login

## Components

### 1. Address Book Service (`src/services/address-book/address-book.service.js`)
- Handles all API calls to the backend
- Implements CRUD operations for addresses
- Manages authentication headers automatically

### 2. Address Book Hook (`src/hooks/use-address-book.js`)
- Central state management for address data
- Handles authentication logic
- Provides consistent interface for both user types
- Manages localStorage for non-authenticated users

### 3. Updated Components
- **CheckoutBillingAddress**: Enhanced checkout flow with address selection
- **AccountBillingAddress**: Full address management interface
- **AddressNewForm**: Improved form with validation and edit support
- **AddressItem**: Enhanced display with better field mapping

## Usage

### Basic Address Management

```javascript
import { useAddressBook } from 'src/hooks/use-address-book';

function MyComponent() {
  const {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
    authenticated
  } = useAddressBook();

  // Add new address
  const handleAddAddress = async (addressData) => {
    try {
      await addAddress(addressData);
      // Address added successfully
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  // Rest of component logic...
}
```

### Address Data Structure

```javascript
const addressData = {
  name: "John Doe",
  email: "john@example.com",
  phoneNumber: "+1234567890",
  company: "Tech Corp", // Optional
  addressType: "Home", // Home, Office, or Other
  address1: "123 Main St",
  address2: "Apt 4B", // Optional
  city: "New York",
  state: "NY",
  postcode: "10001",
  country: "USA",
  primary: false // Only one address can be primary
};
```

### Integration with Checkout

The checkout flow automatically detects user authentication status:

- **Authenticated users**: Can select from saved addresses or add new ones
- **Non-authenticated users**: Can add temporary addresses for checkout
- **Seamless transition**: Temporary addresses are preserved if user logs in later

## API Endpoints

The system integrates with these backend endpoints:

- `GET /api/address-book` - Get all user addresses
- `GET /api/address-book/primary` - Get primary address
- `GET /api/address-book/:id` - Get specific address
- `POST /api/address-book` - Create new address
- `PUT /api/address-book/:id` - Update address
- `DELETE /api/address-book/:id` - Delete address
- `PATCH /api/address-book/:id/primary` - Set as primary

## Error Handling

- **Network Errors**: Graceful fallback with user-friendly messages
- **Validation Errors**: Form-level validation with clear error messages
- **Authentication Errors**: Automatic redirect to login when needed
- **Storage Errors**: Fallback to in-memory storage if localStorage fails

## Security Features

- **JWT Authentication**: All API calls include proper authorization headers
- **User Isolation**: Users can only access their own addresses
- **Input Validation**: Comprehensive validation on both frontend and backend
- **XSS Protection**: Proper escaping of user input in display components

## Browser Compatibility

- **Modern Browsers**: Full localStorage support
- **Fallback Handling**: Graceful degradation for older browsers
- **Mobile Support**: Responsive design for all device sizes

## Migration Path

### For Existing Users
1. Existing mock data continues to work
2. New addresses use the enhanced structure
3. Gradual migration to new API endpoints

### For New Users
1. Immediate access to full address book features
2. Seamless authentication integration
3. Persistent storage from first use

## Testing

### Manual Testing
1. **Authenticated Flow**: Login and test full CRUD operations
2. **Non-authenticated Flow**: Test temporary address storage
3. **Checkout Integration**: Verify address selection in checkout
4. **Error Scenarios**: Test network failures and validation errors

### Automated Testing
- Unit tests for hook logic
- Integration tests for API calls
- Component tests for UI interactions
- E2E tests for complete user flows

## Future Enhancements

- **Address Validation**: Integration with postal service APIs
- **Geocoding**: Automatic coordinate generation for addresses
- **Bulk Operations**: Import/export address lists
- **Address Templates**: Pre-defined address formats for different countries
- **Analytics**: Track address usage patterns for business insights

## Troubleshooting

### Common Issues

1. **Addresses not loading**: Check authentication status and API connectivity
2. **Form validation errors**: Verify all required fields are filled
3. **Storage errors**: Check browser localStorage support and permissions
4. **API errors**: Verify backend service availability and authentication

### Debug Information

Enable debug logging by checking browser console for:
- API request/response details
- Storage operation results
- Authentication status changes
- Error stack traces

## Support

For technical support or feature requests:
1. Check the API documentation
2. Review error logs in browser console
3. Verify authentication configuration
4. Test with different user roles and permissions
