import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAddressBook } from 'src/hooks/use-address-book';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { AddressItem, AddressNewForm } from '../address';

// ----------------------------------------------------------------------

export default function AccountBillingAddress({ addressBook: propAddressBook }) {
  const { authenticated } = useAuthContext();
  const [addressId, setAddressId] = useState('');
  const [editData, setEditData] = useState(null);

  const popover = usePopover();
  const addressForm = useBoolean();

  // Use the hook for dynamic address management
  const {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress,
  } = useAddressBook();

  // Use addresses from hook if available, otherwise fall back to props
  const displayAddresses = addresses.length > 0 ? addresses : (propAddressBook || []);

  const handleAddNewAddress = useCallback(async (address) => {
    try {
      await addAddress(address);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  }, [addAddress]);

  const handleEditAddress = useCallback(async (address) => {
    setEditData(address);
    addressForm.onTrue();
  }, [addressForm]);

  const handleUpdateAddress = useCallback(async (addressData) => {
    try {
      if (editData) {
        const id = editData._id || editData.id;
        await updateAddress(id, addressData);
        setEditData(null);
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  }, [editData, updateAddress]);

  const handleSelectedId = useCallback(
    (event, id) => {
      popover.onOpen(event);
      setAddressId(id);
    },
    [popover]
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setAddressId('');
  }, [popover]);

  const handleSetPrimary = useCallback(async () => {
    try {
      await setPrimaryAddress(addressId);
      handleClose();
    } catch (error) {
      console.error('Error setting primary address:', error);
    }
  }, [addressId, setPrimaryAddress, handleClose]);

  const handleEdit = useCallback(async () => {
    const address = displayAddresses.find(addr => (addr._id || addr.id) === addressId);
    if (address) {
      handleEditAddress(address);
    }
    handleClose();
  }, [addressId, displayAddresses, handleEditAddress, handleClose]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteAddress(addressId);
      handleClose();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  }, [addressId, deleteAddress, handleClose]);

  const handleCloseForm = useCallback(() => {
    addressForm.onFalse();
    setEditData(null);
  }, [addressForm]);

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

    if (displayAddresses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {authenticated 
              ? 'No saved addresses found. Add your first address to get started.'
              : 'No addresses added yet. Add an address to manage your delivery locations.'
            }
          </Typography>
        </Box>
      );
    }

    return displayAddresses.map((address) => (
      <AddressItem
        variant="outlined"
        key={address._id || address.id}
        address={address}
        action={
          <IconButton
            onClick={(event) => {
              handleSelectedId(event, address._id || address.id);
            }}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        }
        sx={{
          p: 2.5,
          borderRadius: 1,
        }}
      />
    ));
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Address Book"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              Add Address
            </Button>
          }
        />

        {!authenticated && (
          <Alert severity="info" sx={{ mx: 3, mb: 2 }}>
            <Typography variant="body2">
              You're not logged in. Addresses will be saved temporarily in your browser.
              <Button 
                color="inherit" 
                size="small" 
                sx={{ ml: 1 }}
                onClick={() => window.location.href = '/auth/login'}
              >
                Login to save permanently
              </Button>
            </Typography>
          </Alert>
        )}

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {renderAddresses()}
        </Stack>
      </Card>

      <CustomPopover open={popover.open} onClose={handleClose}>
        <MenuItem onClick={handleSetPrimary}>
          <Iconify icon="eva:star-fill" />
          Set as primary
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <AddressNewForm
        open={addressForm.value}
        onClose={handleCloseForm}
        onCreate={editData ? handleUpdateAddress : handleAddNewAddress}
        isEdit={!!editData}
        editData={editData}
      />
    </>
  );
}

AccountBillingAddress.propTypes = {
  addressBook: PropTypes.array,
};
