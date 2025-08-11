import { useParams } from "src/routes/hooks";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { useSettingsContext } from "src/components/settings";
import { useGetShippingMethod } from "src/hooks/use-shipping";

import ShippingMethodForm from "../shipping-method-form";

// ----------------------------------------------------------------------

export default function ShippingMethodEditView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { data: currentMethod, isLoading } = useGetShippingMethod(id);

  if (isLoading) {
    return (
      <Container sx={{ textAlign: "center", py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Typography variant="h4" mb={3}>
        Edit Shipping Method
      </Typography>

      <ShippingMethodForm currentMethod={currentMethod} />
    </Container>
  );
}
