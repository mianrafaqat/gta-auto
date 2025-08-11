import PropTypes from "prop-types";
import { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import { useCheckoutContext } from "./context/checkout-context";
import { useCreateOrder } from "src/hooks/use-orders";
import { FormProvider, RHFTextField } from "src/components/hook-form";

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  {
    value: "card",
    label: "Credit / Debit Card",
  },
  {
    value: "paypal",
    label: "PayPal",
  },
  {
    value: "cash",
    label: "Cash on Delivery",
  },
];

// ----------------------------------------------------------------------

export default function CheckoutPayment() {
  const router = useRouter();
  const { checkout = {}, onReset } = useCheckoutContext();
  const { items = [] } = checkout;

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const createOrder = useCreateOrder();

  const CheckoutSchema = Yup.object().shape({
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

    paymentMethod: Yup.string().required("Payment method is required"),
    couponCode: Yup.string(),
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
    billingFirstName: "",
    billingLastName: "",
    billingEmail: "",
    billingPhone: "",
    billingAddress1: "",
    billingCity: "",
    billingState: "",
    billingPostcode: "",
    billingCountry: "",

    paymentMethod: "card",
    couponCode: "",
  };

  const methods = useForm({
    resolver: yupResolver(CheckoutSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (!items.length) {
        setErrorMsg("Your cart is empty");
        return;
      }

      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          variation: item.variation || null,
        })),
        shippingAddress: {
          firstName: data.shippingFirstName,
          lastName: data.shippingLastName,
          address1: data.shippingAddress1,
          city: data.shippingCity,
          state: data.shippingState,
          postcode: data.shippingPostcode,
          country: data.shippingCountry,
          email: data.shippingEmail,
          phone: data.shippingPhone,
        },
        billingAddress: sameAsBilling
          ? {
              firstName: data.shippingFirstName,
              lastName: data.shippingLastName,
              address1: data.shippingAddress1,
              city: data.shippingCity,
              state: data.shippingState,
              postcode: data.shippingPostcode,
              country: data.shippingCountry,
              email: data.shippingEmail,
              phone: data.shippingPhone,
            }
          : {
              firstName: data.billingFirstName,
              lastName: data.billingLastName,
              address1: data.billingAddress1,
              city: data.billingCity,
              state: data.billingState,
              postcode: data.billingPostcode,
              country: data.billingCountry,
              email: data.billingEmail,
              phone: data.billingPhone,
            },
        shippingMethod: checkout.shippingMethod?.id,
        paymentMethod: data.paymentMethod,
        couponCode: data.couponCode || null,
      };

      const response = await createOrder.mutateAsync(orderData);

      onReset();
      router.push({
        pathname: paths.product.checkout.orderSuccess,
        query: {
          id: response.orderId,
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMsg(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Shipping Address
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
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
            value={sameAsBilling}
            onChange={(e) => setSameAsBilling(e.target.value === "true")}>
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

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Payment Method</Typography>
          <RadioGroup name="paymentMethod" defaultValue="card">
            {PAYMENT_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </Stack>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Coupon Code</Typography>
          <RHFTextField
            name="couponCode"
            label="Enter coupon code (optional)"
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={submitting}
          sx={{ mt: 3 }}>
          Place Order
        </LoadingButton>
      </Card>
    </FormProvider>
  );
}

CheckoutPayment.propTypes = {
  onBackStep: PropTypes.func,
};
