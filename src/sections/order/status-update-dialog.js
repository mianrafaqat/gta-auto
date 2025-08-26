"use client";

import PropTypes from "prop-types";
import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import LoadingButton from "@mui/lab/LoadingButton";

export default function StatusUpdateDialog({
  open,
  status,
  onClose,
  onSubmit,
  loading,
}) {
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onSubmit(note);
    setNote(""); // Reset note after submission
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Order Status to {status}</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Add a note (required)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter a note about this status change..."
          helperText="This note will be included in the email sent to the customer"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          disabled={!note.trim()}
          onClick={handleSubmit}
          variant="contained">
          Update Status
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

StatusUpdateDialog.propTypes = {
  open: PropTypes.bool,
  status: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};
