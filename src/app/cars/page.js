import { Container } from "@mui/material";
import GarageView from "src/sections/garage/garage-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "garage tuned autos - Cars",
};

export default function ShopPage() {
  return (
    <Container maxWidth="xl">
      <GarageView />
    </Container>
  );
}
