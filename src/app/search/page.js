import { Container } from "@mui/material";
import UnifiedSearchView from "src/sections/search/unified-search-view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Search Results - City Autos",
};

export default function SearchPage() {
  return (
    <Container maxWidth="xl">
      <UnifiedSearchView />
    </Container>
  );
}

