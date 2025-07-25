import { Container } from "@mui/material";
import { ProductShopView } from "src/sections/product/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "City Autos - Cars",
};

export default function ShopPage() {
  return (
    <Container maxWidth="xl" >
      <ProductShopView />
    </Container>
  );
}
