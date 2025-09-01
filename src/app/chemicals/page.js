import { Container } from "@mui/material";
import Chemicals from "src/components/chemicals";

// ----------------------------------------------------------------------

export const metadata = {
  title: "garage tuned autos - Chemicals",
};

export default function ChemicalsPage() {
  return (
    <Container maxWidth="xl">
      <Chemicals />
    </Container>
  );
}
