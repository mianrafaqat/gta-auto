import { Container } from "@mui/material";
import { ProductShopView } from "src/sections/product/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "City Autos - Home",
};

export default function ShopPage() {
  return (
    <Container maxWidth="xl" >
      <ProductShopView />
    </Container>
  );
}
