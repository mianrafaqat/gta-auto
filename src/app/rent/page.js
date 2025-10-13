import { Container } from "@mui/material";
import RentView from "src/sections/rent/rent-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "garage tuned autos - Rent Cars",
};

export default function RentPage() {
  return (
    <Container maxWidth="xl">
      <RentView />
    </Container>
  );
}

