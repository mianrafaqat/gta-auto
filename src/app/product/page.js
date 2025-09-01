import { Box, Container } from "@mui/material";
import { ProductShopView } from "src/sections/product/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "garage tuned autos - Home",
};

export default function ShopPage() {
  return (
    <Box>
      <ProductShopView />
    </Box>
  );
}
