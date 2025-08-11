import PropTypes from "prop-types";
import React, { useState, useRef } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { useBoolean } from "src/hooks/use-boolean";
import { usePopover } from "src/components/custom-popover";
import CustomPopover from "src/components/custom-popover";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";

// ----------------------------------------------------------------------

export default function AttributeTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onViewRow,
  onDeleteRow,
}) {
  const { name, description, category, status, createdAt } = row;

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
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ListItemText
              primary={name}
              primaryTypographyProps={{ typography: "body2" }}
              secondaryTypographyProps={{
                component: "span",
                color: "text.disabled",
              }}
            />
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {createdAt}
          </Typography>
        </TableCell>

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

AttributeTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
