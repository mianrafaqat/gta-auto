import PropTypes from "prop-types";
import React, { useRef } from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { useBoolean } from "src/hooks/use-boolean";
import CustomPopover from "src/components/custom-popover";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";

// ----------------------------------------------------------------------

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CouponsTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onDeleteRow,
}) {
  const {
    code,
    description,
    discountType,
    discountValue,
    allowedUsers,
    createdAt,
    expiresAt,
  } = row;

  const openConfirm = useBoolean();
  const openPopover = useBoolean();
  const popoverRef = useRef(null);

  const handleOpenPopover = (event) => {
    event.preventDefault();
    event.stopPropagation();
    openPopover.onTrue();
  };

  const handleDelete = () => {
    openPopover.onFalse();
    openConfirm.onTrue();
  };

  const handleEdit = () => {
    onEditRow();
    openPopover.onFalse();
  };

  const handleConfirmDelete = () => {
    onDeleteRow();
    openConfirm.onFalse();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        {/* Coupon Code */}
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ListItemText
              primary={code}
              primaryTypographyProps={{ typography: "body2" }}
              secondaryTypographyProps={{
                component: "span",
                color: "text.disabled",
              }}
            />
          </Stack>
        </TableCell>

        {/* Description */}
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description || "-"}
          </Typography>
        </TableCell>

        {/* Discount Type */}
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {discountType === "fixed"
              ? "Fixed"
              : discountType === "percentage"
                ? "Percentage"
                : "-"}
          </Typography>
        </TableCell>

        {/* Discount Value */}
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {discountValue !== undefined && discountValue !== null
              ? discountValue
              : "-"}
          </Typography>
        </TableCell>

        {/* Allowed Users */}
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {Array.isArray(allowedUsers)
              ? allowedUsers.length
                ? allowedUsers.length
                : "All"
              : "-"}
          </Typography>
        </TableCell>

        {/* Created At */}
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {formatDate(createdAt)}
          </Typography>
        </TableCell>

        {/* Expires At */}
        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {formatDate(expiresAt)}
          </Typography>
        </TableCell>

        {/* Actions */}
        <TableCell align="right">
          <IconButton
            ref={popoverRef}
            color={openPopover.value ? "primary" : "default"}
            onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={openPopover.value}
        onClose={openPopover.onFalse}
        arrow="right-top"
        anchorEl={popoverRef.current}
        sx={{ width: 140 }}>
        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={openConfirm.value}
        onClose={openConfirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}

CouponsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
