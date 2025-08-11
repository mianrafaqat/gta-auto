import { useParams } from "next/navigation";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

import { useSettingsContext } from "src/components/settings";
import { useGetOrderById } from "src/hooks/use-orders";

import OrderDetails from "../order-details";

// ----------------------------------------------------------------------

export default function OrderDetailsView() {
  const settings = useSettingsContext();
  const params = useParams();

  const { data: order, isLoading } = useGetOrderById(params.id);

  if (isLoading) {
    return (
      <Container sx={{ textAlign: "center", py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div>Order not found</div>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <OrderDetails order={order} />
    </Container>
  );
}
