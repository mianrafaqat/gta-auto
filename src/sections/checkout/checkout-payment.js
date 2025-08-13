import PropTypes from "prop-types";
import { useState, useEffect } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import { useCheckoutContext } from "./context/checkout-context";
import { useCreateOrder } from "src/hooks/use-orders";
import FormProvider from "src/components/hook-form/form-provider";
import RHFTextField from "src/components/hook-form/rhf-text-field";
import ShippingService from "src/services/shipping/shipping.service";

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

export default function CheckoutPayment({ onBackStep, onOrderSuccess }) {
  const router = useRouter();
  const { checkout = {}, onReset } = useCheckoutContext();
  const { items = [] } = checkout;

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loadingShipping, setLoadingShipping] = useState(true);

  const createOrder = useCreateOrder();

  // Check if billing information is completed
  useEffect(() => {
    console.log("Checkout billing data:", checkout.billing);
    if (!checkout.billing) {
      setErrorMsg(
        "Please complete billing information first before proceeding to payment."
      );
    } else {
      setErrorMsg(""); // Clear error when billing is available
    }
  }, [checkout.billing]);

  const CheckoutSchema = Yup.object().shape({
    paymentMethod: Yup.string().required("Payment method is required"),
    shippingMethod: Yup.string().required("Shipping method is required"),
    couponCode: Yup.string(),
  });

  const defaultValues = {
    paymentMethod: "card",
    shippingMethod: "",
    couponCode: "",
  };

  const methods = useForm({
    resolver: yupResolver(CheckoutSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;
  const selectedShippingMethod = watch("shippingMethod");
  const selectedPaymentMethod = watch("paymentMethod");

  console.log("Current form values:", {
    paymentMethod: selectedPaymentMethod,
    shippingMethod: selectedShippingMethod,
  });

  // Fetch shipping methods on component mount
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        setLoadingShipping(true);
        const response = await ShippingService.getAllMethods();
        setShippingMethods(response.data || response || []);

        // Set default shipping method if available
        if (response.data?.length > 0 || response?.length > 0) {
          const methods = response.data || response;
          setValue("shippingMethod", methods[0]._id || methods[0].id);
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
        setErrorMsg("Failed to load shipping methods");
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingMethods();
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg("");
    setSubmitting(true);

    console.log("Form data being submitted:", data);
    console.log("Selected payment method:", data.paymentMethod);
    console.log("Selected shipping method:", data.shippingMethod);

    try {
      if (!data.shippingMethod) {
        setErrorMsg("Please select a shipping method");
        return;
      }

      if (!items.length) {
        setErrorMsg("Your cart is empty");
        return;
      }

      // Check if billing information is available
      if (!checkout.billing) {
        setErrorMsg("Please complete billing information first");
        return;
      }

      // Get the selected shipping method details
      const selectedMethod = shippingMethods.find(
        (method) =>
          method._id === data.shippingMethod ||
          method.id === data.shippingMethod
      );

      // Prepare order data with actual user information
      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          variation: item.variation || null,
        })),
        shippingAddress: {
          firstName: checkout.billing.name?.split(" ")[0] || "",
          lastName: checkout.billing.name?.split(" ").slice(1).join(" ") || "",
          address1: checkout.billing.fullAddress || "",
          city: checkout.billing.city || "",
          state: checkout.billing.state || "",
          postcode: checkout.billing.zipCode || "",
          country: checkout.billing.country || "",
          email: checkout.billing.email || "",
          phone: checkout.billing.phoneNumber || "",
        },
        billingAddress: {
          firstName: checkout.billing.name?.split(" ")[0] || "",
          lastName: checkout.billing.name?.split(" ").slice(1).join(" ") || "",
          address1: checkout.billing.fullAddress || "",
          city: checkout.billing.city || "",
          state: checkout.billing.state || "",
          postcode: checkout.billing.zipCode || "",
          country: checkout.billing.country || "",
          email: checkout.billing.email || "",
          phone: checkout.billing.phoneNumber || "",
        },
        shippingMethod: data.shippingMethod,
        paymentMethod: data.paymentMethod,
        couponCode: data.couponCode || null,
        total: checkout.total,
        subTotal: checkout.subTotal,
        shipping: selectedMethod?.price || 0,
        discount: checkout.discount || 0,
      };

      const response = await createOrder.mutateAsync(orderData);

      console.log("Order creation response:", response);

      onReset();

      // Navigate to success page with order data
      const orderId =
        response.orderId ||
        response.id ||
        response._id ||
        response.order?.id ||
        response.order?._id;

      if (orderId) {
        const orderData = {
          orderNumber: orderId,
          createdAt: new Date().toISOString(),
          paymentMethod: data.paymentMethod,
          subTotal: checkout.subTotal,
          shippingCost: selectedMethod?.price || 0,
          total: checkout.total,
        };

        // Call the success handler instead of navigating directly
        if (onOrderSuccess) {
          onOrderSuccess(orderData);
        } else {
          // Fallback to direct navigation if no handler provided
          router.push({
            pathname: paths.product.checkout.orderSuccess,
            query: {
              order: JSON.stringify(orderData),
            },
          });
        }
      } else {
        // If no order ID, just go to success page
        if (onOrderSuccess) {
          onOrderSuccess({});
        } else {
          router.push(paths.product.checkout.orderSuccess);
        }
      }
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
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              !checkout.billing && onBackStep ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={onBackStep}
                  sx={{ textTransform: "none" }}>
                  Go to Billing
                </Button>
              ) : null
            }>
            {errorMsg}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Select Payment Method</Typography>
          <RadioGroup
            name="paymentMethod"
            value={watch("paymentMethod")}
            onChange={(e) => setValue("paymentMethod", e.target.value)}>
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

        {/* Shipping Method Section */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Select Shipping Method</Typography>

          {loadingShipping ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : shippingMethods.length > 0 ? (
            <RadioGroup name="shippingMethod" value={selectedShippingMethod}>
              {shippingMethods.map((method) => (
                <FormControlLabel
                  key={method._id || method.id}
                  value={method._id || method.id}
                  control={<Radio />}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {method.name || method.title}
                        </Typography>
                        {method.description && (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}>
                            {method.description}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#4caf50" }}>
                        ${method.price || method.cost || 0}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    width: "100%",
                    margin: 0,
                    padding: 2,
                    border: "1px solid",
                    borderColor:
                      selectedShippingMethod === (method._id || method.id)
                        ? "#4caf50"
                        : "divider",
                    borderRadius: 1,
                    "&:hover": {
                      borderColor: "#4caf50",
                      backgroundColor: "rgba(76, 175, 80, 0.04)",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          ) : (
            <Alert severity="warning">
              No shipping methods available. Please contact support.
            </Alert>
          )}
        </Stack>

        {/* Billing Information Summary */}
        {checkout.billing && (
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Billing Information</Typography>
            <Card
              sx={{
                p: 2,
                backgroundColor: "rgba(76, 175, 80, 0.04)",
                border: "1px solid #4caf50",
              }}>
              <Stack spacing={1}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {checkout.billing.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {checkout.billing.fullAddress}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Phone: {checkout.billing.phoneNumber}
                </Typography>
                {checkout.billing.email && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Email: {checkout.billing.email}
                  </Typography>
                )}
              </Stack>
            </Card>
          </Stack>
        )}

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
            disabled={!checkout.billing}
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
