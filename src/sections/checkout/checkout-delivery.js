import PropTypes from "prop-types";
import { useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

import Iconify from "src/components/iconify";
import { useCheckoutContext } from "./context/checkout-context";
import { useGetAvailableShippingMethods } from "src/hooks/use-shipping";

// ----------------------------------------------------------------------

export default function CheckoutDelivery({ onBackStep, onNextStep }) {
  const { checkout, onApplyShipping } = useCheckoutContext();

  const [selectedMethod, setSelectedMethod] = useState(
    checkout.shippingMethod?.id || ""
  );

  const {
    data: methods = [],
    isLoading,
    error,
  } = useGetAvailableShippingMethods({
    country: checkout.billing?.country || "US",
    orderAmount: checkout.total || 0,
  });

  const handleChangeMethod = (event) => {
    const methodId = event.target.value;
    const method = methods.find((m) => m._id === methodId);
    setSelectedMethod(methodId);
    if (method) {
      onApplyShipping({
        id: method._id,
        name: method.name,
        price: method.price,
        estimatedDelivery: method.estimatedDelivery,
      });
    }
  };

  const handleNext = () => {
    if (!selectedMethod) {
      // Show error or alert that shipping method is required
      return;
    }
    onNextStep();
  };

  const renderShippingMethods = () => {
    if (isLoading) {
      return (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || "Failed to load shipping methods"}
        </Alert>
      );
    }

    if (!methods.length) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          No shipping methods available for your location
        </Alert>
      );
    }

    return (
      <RadioGroup value={selectedMethod} onChange={handleChangeMethod}>
        <Box
          gap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}>
          {methods.map((method) => (
            <OptionItem
              key={method._id}
              method={method}
              selected={selectedMethod === method._id}
            />
          ))}
        </Box>
      </RadioGroup>
    );
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 5 }}>
        Shipping Method
      </Typography>

      {renderShippingMethods()}

      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        sx={{ mt: 3 }}>
        <Button
          color="inherit"
          onClick={onBackStep}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          disabled={!selectedMethod}>
          Next
        </Button>
      </Stack>
    </>
  );
}

CheckoutDelivery.propTypes = {
  onBackStep: PropTypes.func,
  onNextStep: PropTypes.func,
};

// ----------------------------------------------------------------------

function OptionItem({ method, selected }) {
  const { name, price, estimatedDelivery } = method;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        cursor: "pointer",
        borderRadius: 1,
        position: "relative",
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
        }),
      }}>
      <FormControlLabel
        value={method._id}
        control={<Radio sx={{ display: "none" }} />}
        label={
          <Stack spacing={0.5}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between">
              <Typography variant="subtitle2">{name}</Typography>
              <Typography variant="subtitle2">${price}</Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {estimatedDelivery
                ? `${estimatedDelivery.min}-${estimatedDelivery.max} business days`
                : "Delivery time not available"}
            </Typography>
          </Stack>
        }
        sx={{
          m: 0,
          width: 1,
          "& .MuiFormControlLabel-label": {
            width: 1,
          },
        }}
      />
    </Paper>
  );
}

OptionItem.propTypes = {
  method: PropTypes.object,
  selected: PropTypes.bool,
};
