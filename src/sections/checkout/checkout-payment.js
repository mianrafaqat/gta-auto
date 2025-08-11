import PropTypes from "prop-types";
import { useState } from "react";
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
import Button from "@mui/material/Button";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import { useCheckoutContext } from "./context/checkout-context";
import { useCreateOrder } from "src/hooks/use-orders";
import FormProvider from "src/components/hook-form/form-provider";
import RHFTextField from "src/components/hook-form/rhf-text-field";

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

export default function CheckoutPayment({ onBackStep }) {
  const router = useRouter();
  const { checkout = {}, onReset } = useCheckoutContext();
  const { items = [] } = checkout;

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const createOrder = useCreateOrder();

  const CheckoutSchema = Yup.object().shape({
    paymentMethod: Yup.string().required("Payment method is required"),
    couponCode: Yup.string(),
  });

  const defaultValues = {
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
      if (!checkout.shippingMethod?.id) {
        setErrorMsg("Please select a shipping method");
        return;
      }

      if (!items.length) {
        setErrorMsg("Your cart is empty");
        return;
      }

      // For now, use mock shipping and billing data
      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          variation: item.variation || null,
        })),
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address1: "123 Main St",
          city: "New York",
          state: "NY",
          postcode: "10001",
          country: "US",
          email: "john@example.com",
          phone: "1234567890",
        },
        billingAddress: {
          firstName: "John",
          lastName: "Doe",
          address1: "123 Main St",
          city: "New York",
          state: "NY",
          postcode: "10001",
          country: "US",
          email: "john@example.com",
          phone: "1234567890",
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
          Payment Method
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Select Payment Method</Typography>
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

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Coupon Code</Typography>
          <RHFTextField
            name="couponCode"
            label="Enter coupon code (optional)"
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          {onBackStep && (
            <Button variant="outlined" onClick={onBackStep} sx={{ flex: 1 }}>
              Back
            </Button>
          )}

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={submitting}
            sx={{ flex: 1 }}>
            Place Order
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}

CheckoutPayment.propTypes = {
  onBackStep: PropTypes.func,
};
