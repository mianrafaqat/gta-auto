import { Box, Container } from "@mui/material";
import { ProductShopView } from "src/sections/product/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "GTA Auto - Home",
};

export default function ShopPage() {
  return (
    <Box>
      <ProductShopView />
    </Box>
  );
}
