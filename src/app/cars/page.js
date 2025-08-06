import { Container } from "@mui/material";
import GarageView from "src/sections/garage/garage-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "GTA Auto - Cars",
};

export default function ShopPage() {
  return (
    <Container maxWidth="xl">
      <GarageView />
    </Container>
  );
}
