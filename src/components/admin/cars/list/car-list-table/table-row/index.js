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
import {
  Autocomplete,
  Box,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { paths } from "src/routes/paths";
import { fDate, fTime } from "src/utils/format-time";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { CarsService } from "src/services";

// import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

export default function CarTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  carDealOptions,
  onSuccess =() => {}
}) {
  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();


  const quickEdit = useBoolean();

  const popover = usePopover();

  const [selectedCarDeal, setCarDealOptions] = useState({});

  const handleSelectedCarDeal = (value) => {
    try {
      let filterDeal = carDealOptions.find((deal) => deal.value === value);
      if (!filterDeal) {
        filterDeal = carDealOptions.find((deal) => deal.value === "no");
        setCarDealOptions(filterDeal);
      } else {
        setCarDealOptions(filterDeal);
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const onChangeDeal = async (deal) => {
    try {
      const values = {
        carID: row?._id,
        ownerID: row?.owner?._id,
        deal,
      };

      console.log("values: ", values);
      
      const res = await CarsService.update(values);
      if (res.status === 200) {
        enqueueSnackbar(res?.data);
        onSuccess();
      } 
    } catch (err) {
      enqueueSnackbar(err, { variant: "error" });
    } finally {
    }
  };

  useEffect(() => {
    handleSelectedCarDeal(row?.deal);
  }, [row]);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ display: "flex", alignItems: "center" }}>
          <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
            <Avatar
              alt={row?.name}
              src={row?.image?.[0]}
              variant="rounded"
              sx={{ width: 64, height: 64, mr: 2 }}
            />

            <ListItemText
              primary={
                <Typography
                  noWrap
                  variant="body2"
                  sx={{ display: "block", maxWidth: "200px" }}
                >
                  <Link
                    noWrap
                    color="inherit"
                    variant="body2"
                    href={paths.dashboard.cars.details(row?._id)}
                    sx={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    {row.title}
                  </Link>
                </Typography>
              }
              secondary={
                <Box
                  component="div"
                  sx={{ typography: "body2", color: "text.disabled" }}
                >
                  {row.category}
                </Box>
              }
              sx={{ display: "flex", flexDirection: "column" }}
            />
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <ListItemText
            primary={fDate(row.createdAt)}
            secondary={fTime(row.createdAt)}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>PKR{row.price}</TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <ListItemText
            primary={fDate(row.expireAt)}
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>

        <TableCell>
          <Autocomplete
            fullWidth
            value={selectedCarDeal}
            disableClearable={true}
            options={carDealOptions}
            getOptionLabel={(option) => option.label}
            onChange={(event, deal) => {
              console.log("deal: ", deal)
              handleSelectedCarDeal(deal);
              onChangeDeal(deal?.value)
            }}
            renderInput={(params) => <TextField {...params} margin="none" />}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            )}
          />
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
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
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

CarTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
