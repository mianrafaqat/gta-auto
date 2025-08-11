import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";

import FormProvider from "src/components/hook-form/form-provider";
import RHFTextField from "src/components/hook-form/rhf-text-field";

// ----------------------------------------------------------------------

export default function CheckoutBilling({ onSubmit, loading, error }) {
  const BillingSchema = Yup.object().shape({
    // Shipping Address
    shippingFirstName: Yup.string().required("First name is required"),
    shippingLastName: Yup.string().required("Last name is required"),
    shippingEmail: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    shippingPhone: Yup.string().required("Phone number is required"),
    shippingAddress1: Yup.string().required("Address is required"),
    shippingCity: Yup.string().required("City is required"),
    shippingState: Yup.string().required("State is required"),
    shippingPostcode: Yup.string().required("Postal code is required"),
    shippingCountry: Yup.string().required("Country is required"),
  });

  const defaultValues = {
    // Shipping Address
    shippingFirstName: "",
    shippingLastName: "",
    shippingEmail: "",
    shippingPhone: "",
    shippingAddress1: "",
    shippingCity: "",
    shippingState: "",
    shippingPostcode: "",
    shippingCountry: "",
  };

  const methods = useForm({
    resolver: yupResolver(BillingSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Shipping Address
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}>
          <RHFTextField name="shippingFirstName" label="First Name" />
          <RHFTextField name="shippingLastName" label="Last Name" />
          <RHFTextField name="shippingEmail" label="Email" />
          <RHFTextField name="shippingPhone" label="Phone" />
          <RHFTextField
            name="shippingAddress1"
            label="Address"
            sx={{ gridColumn: { sm: "1 / -1" } }}
          />
          <RHFTextField name="shippingCity" label="City" />
          <RHFTextField name="shippingState" label="State" />
          <RHFTextField name="shippingPostcode" label="Postal Code" />
          <RHFTextField name="shippingCountry" label="Country" />
        </Box>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
          sx={{ mt: 3 }}>
          Continue
        </LoadingButton>
      </Card>
    </FormProvider>
  );
}

CheckoutBilling.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
};
