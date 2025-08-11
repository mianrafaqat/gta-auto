import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { FormProvider, RHFTextField } from "src/components/hook-form";

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

    // Billing Address (only if different from shipping)
    sameAsBilling: Yup.boolean(),
    billingFirstName: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().required("First name is required"),
    }),
    billingLastName: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().required("Last name is required"),
    }),
    billingEmail: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().email("Invalid email").required("Email is required"),
    }),
    billingPhone: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().required("Phone number is required"),
    }),
    billingAddress1: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().required("Address is required"),
    }),
    billingCity: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().required("City is required"),
    }),
    billingState: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().required("State is required"),
    }),
    billingPostcode: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().required("Postal code is required"),
    }),
    billingCountry: Yup.string().when("sameAsBilling", {
      is: false,
      then: Yup.string().required("Country is required"),
    }),
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

    // Billing Address
    sameAsBilling: true,
    billingFirstName: "",
    billingLastName: "",
    billingEmail: "",
    billingPhone: "",
    billingAddress1: "",
    billingCity: "",
    billingState: "",
    billingPostcode: "",
    billingCountry: "",
  };

  const methods = useForm({
    resolver: yupResolver(BillingSchema),
    defaultValues,
  });

  const { watch, handleSubmit } = methods;
  const sameAsBilling = watch("sameAsBilling");

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

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Billing Address</Typography>
          <RadioGroup
            name="sameAsBilling"
            value={sameAsBilling}
            onChange={(e) =>
              methods.setValue("sameAsBilling", e.target.value === "true")
            }>
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Same as shipping address"
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="Use different billing address"
            />
          </RadioGroup>
        </Stack>

        {!sameAsBilling && (
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
            sx={{ mt: 3 }}>
            <RHFTextField name="billingFirstName" label="First Name" />
            <RHFTextField name="billingLastName" label="Last Name" />
            <RHFTextField name="billingEmail" label="Email" />
            <RHFTextField name="billingPhone" label="Phone" />
            <RHFTextField
              name="billingAddress1"
              label="Address"
              sx={{ gridColumn: { sm: "1 / -1" } }}
            />
            <RHFTextField name="billingCity" label="City" />
            <RHFTextField name="billingState" label="State" />
            <RHFTextField name="billingPostcode" label="Postal Code" />
            <RHFTextField name="billingCountry" label="Country" />
          </Box>
        )}

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
