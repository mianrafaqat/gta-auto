import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { useBoolean } from "src/hooks/use-boolean";

import { fCurrency } from "src/utils/format-number";
import { fDate, fTime } from "src/utils/format-time";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

export default function MyOrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onCancelOrder,
}) {
  const {
    items,
    status,
    orderNumber,
    createdAt,
    customer,
    subtotal,
    finalTotal,
  } = row;

  // Calculate total quantity from items
  const totalQuantity =
    items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}>
            <Avatar
              alt={customer?.name}
              src={customer?.avatarUrl}
              sx={{
                width: 48,
                height: 48,
              }}>
              {customer?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <ListItemText
              primary={orderNumber}
              secondary={customer?.name}
              primaryTypographyProps={{
                typography: "body2",
                fontWeight: 600,
                color: "text.primary",
                noWrap: true,
              }}
              secondaryTypographyProps={{
                typography: "caption",
                color: "text.disabled",
                noWrap: true,
              }}
            />
          </Box>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(createdAt)}
            secondary={fTime(createdAt)}
            primaryTypographyProps={{
              typography: "body2",
              color: "text.primary",
              noWrap: true,
            }}
            secondaryTypographyProps={{
              typography: "caption",
              color: "text.disabled",
              noWrap: true,
            }}
          />
        </TableCell>

        <TableCell align="center">
          <Label variant="soft" color="info">
            {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
          </Label>
        </TableCell>

        <TableCell align="right">
          <ListItemText
            primary={fCurrency(finalTotal)}
            secondary={fCurrency(subtotal)}
            primaryTypographyProps={{
              typography: "body2",
              color: "text.primary",
              fontWeight: 600,
              noWrap: true,
            }}
            secondaryTypographyProps={{
              typography: "caption",
              color: "text.disabled",
              noWrap: true,
            }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === "completed" && "success") ||
              (status === "pending" && "warning") ||
              (status === "cancelled" && "error") ||
              "default"
            }>
            {status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}>
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}>
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        {status === 'pending' && onCancelOrder && (
          <MenuItem
            onClick={() => {
              onCancelOrder(row);
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}>
            <Iconify icon="solar:close-circle-bold" />
            Cancel Order
          </MenuItem>
        )}
      </CustomPopover>
    </>
  );
}

MyOrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onCancelOrder: PropTypes.func,
};
