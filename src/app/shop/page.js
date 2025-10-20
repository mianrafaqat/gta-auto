import { Box, Container } from "@mui/material";
import { ProductShopView } from "src/sections/product/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Shop by Garage Tuned Autos",
};

export default function ShopPage() {
  return (
    <Box>
      <ProductShopView />
    </Box>
  );
}
