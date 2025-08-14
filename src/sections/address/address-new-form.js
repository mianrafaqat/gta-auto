<<<<<<< Updated upstream
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
=======
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
>>>>>>> Stashed changes

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { countries } from "src/assets/data";

import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from "src/components/hook-form";

// ----------------------------------------------------------------------

export default function AddressNewForm({ open, onClose, onCreate, isEdit = false, editData = null }) {
  const NewAddressSchema = Yup.object().shape({
<<<<<<< Updated upstream
    name: Yup.string().required("Fullname is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    zipCode: Yup.string().required("Zip code is required"),
    // not required
=======
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address1: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postcode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
    // Optional fields
    company: Yup.string(),
    address2: Yup.string(),
>>>>>>> Stashed changes
    addressType: Yup.string(),
    primary: Yup.boolean(),
  });

  const defaultValues = {
<<<<<<< Updated upstream
    name: "",
    city: "",
    state: "",
    address: "",
    zipCode: "",
    primary: true,
    phoneNumber: "",
    addressType: "Home",
    country: "",
=======
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
>>>>>>> Stashed changes
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues: editData || defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  // Reset form when editData changes
  useEffect(() => {
    if (editData) {
      reset(editData);
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Generate fullAddress if not provided
      const fullAddress = data.fullAddress || `${data.address1}${data.address2 ? `, ${data.address2}` : ''}, ${data.city}, ${data.state}, ${data.postcode}, ${data.country}`;
      
      const addressData = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
<<<<<<< Updated upstream
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
=======
        company: data.company || '',
>>>>>>> Stashed changes
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

      await onCreate(addressData);
      onClose();
      reset(defaultValues);
    } catch (error) {
      console.error(error);
    }
  });

  const handleClose = () => {
    onClose();
    reset(defaultValues);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Address' : 'New Address'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <RHFRadioGroup
              row
              name="addressType"
              options={[
<<<<<<< Updated upstream
                { label: "Home", value: "Home" },
                { label: "Office", value: "Office" },
=======
                { label: 'Home', value: 'Home' },
                { label: 'Office', value: 'Office' },
                { label: 'Other', value: 'Other' },
>>>>>>> Stashed changes
              ]}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}>
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
<<<<<<< Updated upstream
                xs: "repeat(1, 1fr)",
                sm: "repeat(3, 1fr)",
              }}>
              <RHFTextField name="city" label="Town / City" />

              <RHFTextField name="state" label="State" />

              <RHFTextField name="zipCode" label="Zip/Code" />
=======
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="city" label="City" />
              <RHFTextField name="state" label="State/Province" />
              <RHFTextField name="postcode" label="Postal Code" />
>>>>>>> Stashed changes
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
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>

<<<<<<< Updated upstream
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}>
            Deliver to this Address
=======
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {isEdit ? 'Update Address' : 'Add Address'}
>>>>>>> Stashed changes
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AddressNewForm.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
  isEdit: PropTypes.bool,
  editData: PropTypes.object,
};
