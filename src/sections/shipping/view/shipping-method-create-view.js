import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useSettingsContext } from "src/components/settings";

import ShippingMethodForm from "../shipping-method-form";

// ----------------------------------------------------------------------

export default function ShippingMethodCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Typography variant="h4" mb={3}>
        Create New Shipping Method
      </Typography>

      <ShippingMethodForm />
    </Container>
  );
}
