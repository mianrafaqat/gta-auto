import { Container } from "@mui/material";
import GuardView from "src/sections/guard/guard-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "garage tuned autos - Security Guard Services",
};

export default function GuardPage() {
  return (
    <Container maxWidth="xl">
      <GuardView />
    </Container>
  );
}

