import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { usePopover } from "src/components/custom-popover";
import CustomPopover from "src/components/custom-popover/custom-popover";

// ----------------------------------------------------------------------

export default function ShippingMethodTableRow({
  row,
  selected,
  onEditRow,
  onDeleteRow,
}) {
  const { name, price, estimatedDelivery, countries, isActive } = row;

  const popover = usePopover();

  return (
    <TableRow hover selected={selected}>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Typography variant="body2" noWrap>
          ${price.toFixed(2)}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" noWrap>
          {estimatedDelivery
            ? `${estimatedDelivery.min}-${estimatedDelivery.max} days`
            : "N/A"}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" noWrap>
          {countries?.length ? countries.join(", ") : "All Countries"}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={isActive ? "success" : "error"}
          sx={{ textTransform: "capitalize" }}>
          {isActive ? "active" : "inactive"}
        </Label>
      </TableCell>

      <TableCell align="right">
        <IconButton
          color={popover.open ? "primary" : "default"}
          onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 140 }}>
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDeleteRow();
              popover.onClose();
            }}
            sx={{ color: "error.main" }}>
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        </CustomPopover>
      </TableCell>
    </TableRow>
  );
}

ShippingMethodTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
