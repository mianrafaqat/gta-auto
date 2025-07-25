import { Container } from "@mui/material";
import MainLayout from "src/layouts/main";

export default function FavouriteLayout({ children }) {
  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ pt: 10 }}>
        {children}
      </Container>
    </MainLayout>
  );
}
