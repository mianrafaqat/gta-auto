import { useSettingsContext } from "src/components/settings";
import Container from "@mui/material/Container";

import ShippingMethodsList from "../shipping-methods-list";

// ----------------------------------------------------------------------

export default function ShippingMethodsListView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <ShippingMethodsList />
    </Container>
  );
}
