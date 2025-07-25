import PropTypes from "prop-types";

import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { useBoolean } from "src/hooks/use-boolean";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { Autocomplete, Box, Link, Stack, TextField, Typography } from "@mui/material";
import { paths } from "src/routes/paths";
import { fDate, fTime } from "src/utils/format-time";
import { useMemo, useState } from "react";

// import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  handleBanorPermistUser,
}) {

  console.log("row: ", row);

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ display: "flex", alignItems: "center" }}>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ py: 2, width: 1, gap: 1 }}
          >
            {/* <Avatar
              alt={row?.name}
              src={row?.image?.[0]}
              variant="rounded"
              sx={{ width: 64, height: 64, mr: 2 }}
            /> */}
            <Avatar
              sx={{
                width: 36,
                height: 36,
                border: (theme) =>
                  `solid 2px ${theme.palette.background.default}`,
              }}
            >
              {row?.name?.charAt(0)?.toUpperCase()}
            </Avatar>

            <ListItemText
              primary={
                <Typography
                  noWrap
                  variant="body2"
                  sx={{ display: "block", maxWidth: "200px" }}
                >
                  {row.name}
                </Typography>
              }
              sx={{ display: "flex", flexDirection: "column" }}
            />
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{row?.email}</TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Label color={row?.isVerified ? "success" : "error"}>
            {row?.isVerified ? "Yes" : "No"}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {row?.isVerified === false ? (
            "—"
          ) : (
            <Label color={!row?.ban ? "success" : "error"}>
              {!row?.ban ? "Active" : "Banned"}
            </Label>
          )}
        </TableCell>
        
        <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={row?.isVerified ? popover.onOpen : () => {}}
          >
            <Iconify
              style={{ color: !row?.isVerified ? "lightgray" : "black" }}
              icon="eva:more-vertical-fill"
            />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleBanorPermistUser();
            popover.onClose();
          }}
          sx={{ color: row?.ban ? "success.main" : "error.main" }}
        >
          <Iconify icon={row?.ban ? "mdi:tick" : "raphael:no"} />
          {row?.ban ? "Permit User" : "Ban User"}
        </MenuItem>
      </CustomPopover>
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
