import { Container } from "@mui/material";
import Chemicals from "src/components/chemicals";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Garage Tuned Autos - Chemicals",
};

export default function ChemicalsPage() {
  return (
    <Container maxWidth="xl">
      <Chemicals />
    </Container>
  );
}
