import { useSettingsContext } from "src/components/settings";
import Container from "@mui/material/Container";

import OrdersList from "../orders-list";

// ----------------------------------------------------------------------

export default function OrdersListView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <OrdersList />
    </Container>
  );
}
