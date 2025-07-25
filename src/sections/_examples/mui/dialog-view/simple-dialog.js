import { useState, useCallback } from "react";

import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { Box } from "@mui/material";
import FormProvider from "src/components/hook-form/form-provider";
import CheckAvailabiltyForm from "src/sections/product/check-availabilty-form";

// ----------------------------------------------------------------------

const emails = ["username@gmail.com", "user02@gmail.com"];

export default function SimpleDialog() {
  const dialog = useBoolean();

  const [selectedValue, setSelectedValue] = useState(emails[1]);

  const handleClose = useCallback(
    (value) => {
      dialog.onFalse();
      setSelectedValue(value);
    },
    [dialog]
  );

  return (
    <>
      <Button sx={{
        minWidth:'90%'
      }} color={"primary"} variant="contained" onClick={dialog.onTrue}>
        Request Info
      </Button>

      <Dialog maxWidth='sm' open={dialog.value} onClose={() => handleClose(selectedValue)}>
        <Box sx={{p:4}}>
         <CheckAvailabiltyForm />
        </Box>
      </Dialog>
    </>
  );
}
