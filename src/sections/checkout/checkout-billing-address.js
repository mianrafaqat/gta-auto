import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAddressBook } from 'src/hooks/use-address-book';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { countries } from 'src/assets/data';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from 'src/components/hook-form';

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

  // Form schema for inline address form
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address1: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postcode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
    company: Yup.string(),
    address2: Yup.string(),
    addressType: Yup.string(),
    primary: Yup.boolean(),
  });

  const defaultValues = {
    name: '',
    email: '',
    company: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    addressType: 'Home',
    primary: false,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAddress = async (addressData) => {
    try {
      const newAddress = await addAddress(addressData);
      checkout.onCreateBilling(newAddress);
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const fullAddress = `${data.address1}${data.address2 ? `, ${data.address2}` : ''}, ${data.city}, ${data.state}, ${data.postcode}, ${data.country}`;
      
      const addressData = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        company: data.company || '',
        addressType: data.addressType,
        address1: data.address1,
        address2: data.address2 || '',
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
        fullAddress,
        primary: data.primary,
      };

      await handleCreateAddress(addressData);
    } catch (error) {
      console.error(error);
    }
  });

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
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {authenticated 
              ? 'Add Your Delivery Address'
              : 'Add an address to continue with checkout'
            }
          </Typography>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
              <RHFRadioGroup
                row
                name="addressType"
                options={[
                  { label: 'Home', value: 'Home' },
                  { label: 'Office', value: 'Office' },
                  { label: 'Other', value: 'Other' },
                ]}
              />

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="name" label="Full Name" />
                <RHFTextField name="email" label="Email Address" />
              </Box>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="company" label="Company (Optional)" />
                <RHFTextField name="phoneNumber" label="Phone Number" />
              </Box>

              <RHFTextField name="address1" label="Address Line 1" />
              <RHFTextField name="address2" label="Address Line 2 (Optional)" />

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <RHFTextField name="city" label="City" />
                <RHFTextField name="state" label="State/Province" />
                <RHFTextField name="postcode" label="Postal Code" />
              </Box>

              <RHFAutocomplete
                name="country"
                type="country"
                label="Country"
                placeholder="Choose a country"
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />

              <RHFCheckbox name="primary" label="Use this address as default" />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <LoadingButton 
                  type="submit" 
                  variant="contained" 
                  loading={isSubmitting}
                  size="large"
                >
                  Save & Continue
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
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
                  onClick={() => window.location.href = '/login/?returnTo=%2Fproduct%2Fcheckout%2F'}
                >
                  Login to save addresses permanently
                </Button>
              </Typography>
            </Alert>
          )}

          {renderAddresses()}

          {addresses.length > 0 && (
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
          )}

          {addresses.length === 0 && (
            <Button
              size="small"
              color="inherit"
              sx={{ color: 'white' }}
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>
          )}
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total || 0}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            shipping={checkout.shipping || 250}
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
