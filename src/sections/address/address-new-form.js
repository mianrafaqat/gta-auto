import * as Yup from "yup";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from 'react';

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
    name: Yup.string().required("Fullname is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    zipCode: Yup.string().required("Zip code is required"),
    // not required
    addressType: Yup.string(),
    primary: Yup.boolean(),
  });

  const defaultValues = {
    name: "",
    city: "",
    state: "",
    address: "",
    zipCode: "",
    primary: true,
    phoneNumber: "",
    addressType: "Home",
    country: "",
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
      const addressData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        addressType: data.addressType,
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
                { label: "Home", value: "Home" },
                { label: "Office", value: "Office" },
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
              <RHFTextField name="phoneNumber" label="Phone Number" />
            </Box>

            <RHFTextField name="address" label="Address" />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(3, 1fr)",
              }}>
              <RHFTextField name="city" label="Town / City" />

              <RHFTextField name="state" label="State" />

              <RHFTextField name="zipCode" label="Zip/Code" />
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

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}>
            Deliver to this Address
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
