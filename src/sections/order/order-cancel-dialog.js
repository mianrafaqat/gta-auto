import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

export default function OrderCancelDialog({ open, onClose, onSubmit, loading }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }
    
    if (reason.trim().length < 10) {
      setError('Please provide a more detailed reason (minimum 10 characters)');
      return;
    }
    
    setError('');
    onSubmit(reason);
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>Cancel Order</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for cancellation"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            disabled={loading}
            placeholder="Please explain why you're cancelling this order"
            helperText={error || "This information helps us improve our service"}
            error={!!error}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          color="inherit"
          variant="outlined"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OrderCancelDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};
