import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function ShippingMethodTableToolbar({
  filterName,
  onFilterName,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: "column",
        sm: "row",
      }}
      sx={{ px: 2.5, py: 3 }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search shipping method..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

ShippingMethodTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
