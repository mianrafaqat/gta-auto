import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAddressBook } from 'src/hooks/use-address-book';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import Iconify from 'src/components/iconify';

import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import { AddressItem, AddressNewForm } from '../address';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();
  const { authenticated } = useAuthContext();
  const addressForm = useBoolean();
  
  const {
    addresses,
    loading,
    error,
    addAddress,
    deleteAddress,
    setPrimaryAddress,
  } = useAddressBook();

  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleCreateAddress = async (addressData) => {
    try {
      const newAddress = await addAddress(addressData);
      checkout.onCreateBilling(newAddress);
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    checkout.onCreateBilling(address);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      // If the deleted address was selected, clear selection
      if (selectedAddress && (selectedAddress._id === addressId || selectedAddress.id === addressId)) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetPrimary = async (addressId) => {
    try {
      await setPrimaryAddress(addressId);
    } catch (error) {
      console.error('Error setting primary address:', error);
    }
  };

  const renderAddresses = () => {
    if (loading) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Loading addresses...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }

    if (addresses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {authenticated 
              ? 'No saved addresses found. Add your first address to continue.'
              : 'No addresses added yet. Add an address to continue with checkout.'
            }
          </Typography>
        </Box>
      );
    }

    return addresses.slice(0, 4).map((address) => (
      <AddressItem
        key={address._id || address.id}
        address={address}
        action={
          <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
            {!address.primary && (
              <Button 
                size="small" 
                color="error" 
                sx={{ mr: 1 }}
                onClick={() => handleDeleteAddress(address._id || address.id)}
              >
                Delete
              </Button>
            )}
            <Button
              size="small"
              color="info"
              sx={{ mr: 1 }}
              onClick={() => handleSetPrimary(address._id || address.id)}
            >
              Set as Primary
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleSelectAddress(address)}
            >
              Deliver to this Address
            </Button>
          </Stack>
        }
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.card,
        }}
      />
    ));
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {!authenticated && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                You're not logged in. Your address will be saved temporarily for this checkout session.
                <Button 
                  color="inherit" 
                  size="small" 
                  sx={{ ml: 1 }}
                  onClick={() => window.location.href = '/auth/jwt/login/?returnTo=%2Fproduct%2Fcheckout%2F'}
                >
                  Login to save addresses permanently
                </Button>
              </Typography>
            </Alert>
          )}

          {renderAddresses()}

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              sx={{ color: 'white' }}
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {authenticated ? 'New Address' : 'Add Address'}
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
          />
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={handleCreateAddress}
      />
    </>
  );
}
