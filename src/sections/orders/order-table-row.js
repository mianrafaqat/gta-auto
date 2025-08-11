import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { usePopover } from "src/components/custom-popover";
import CustomPopover from "src/components/custom-popover/custom-popover";

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, onViewRow }) {
  // If row is null, undefined, or empty, show "Data not found" message
  if (!row || Object.keys(row).length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} align="center">
          <Typography variant="subtitle1" color="text.secondary">
            Data not found
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  const { _id, items, shippingAddress, paymentMethod, status, total } = row;

  const popover = usePopover();

  const renderCustomer = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <div>
        <Typography variant="subtitle2" noWrap>
          {shippingAddress?.firstName && shippingAddress?.lastName
            ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
            : "N/A"}
        </Typography>
        <Typography variant="body2" noWrap sx={{ color: "text.secondary" }}>
          {shippingAddress?.email || "N/A"}
        </Typography>
      </div>
    </Stack>
  );

  const renderItems = (
    <Typography variant="body2">
      {items?.length || 0} item{items && items.length > 1 ? "s" : ""}
    </Typography>
  );

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {_id}
        </Typography>
      </TableCell>

      <TableCell>{renderCustomer}</TableCell>

      <TableCell>{renderItems}</TableCell>

      <TableCell align="right">
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          ${typeof total === "number" ? total.toFixed(2) : "0.00"}
        </Typography>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (paymentMethod === "card" && "success") ||
            (paymentMethod === "paypal" && "info") ||
            "default"
          }>
          {paymentMethod}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={
            (status === "completed" && "success") ||
            (status === "processing" && "warning") ||
            (status === "cancelled" && "error") ||
            "default"
          }>
          {status}
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
              onViewRow();
              popover.onClose();
            }}>
            <Iconify icon="eva:eye-fill" />
            View
          </MenuItem>
        </CustomPopover>
      </TableCell>
    </TableRow>
  );
}

OrderTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
};
