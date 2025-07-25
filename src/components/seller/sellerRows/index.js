import PropTypes from 'prop-types';

import { TableRow, TableCell, MenuItem, IconButton, Button } from '@mui/material';

import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import { ResendEmailService } from 'src/services';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import Label from 'src/components/label';

export default function SellerRows({
  selected,
  row,
  onDeleteRow = () => {},
  handleEditSeller = () => {},
}) {
  const popover = usePopover();
  const confirm = useBoolean();
  const handleResendEmail = async (values) => {
    try {
      const response = await ResendEmailService.resendEmail({
        eBayUserName: values?.userId,
        email: values?.email,
      });
      if (response?.data?.data) {
        enqueueSnackbar(response?.data?.description, {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(response?.data?.description, {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <TableRow hover selected={selected}>
      <TableCell>{row?.userId || '—'}</TableCell>
      <TableCell>{row?.ebayEmail || '—'}</TableCell>
      <TableCell>{row?.email || '—'}</TableCell>
      <TableCell>
        {row?.isAuthorised ? (
          <Label variant="soft" color="success">
            Yes
          </Label>
        ) : (
          <Label variant="soft" color="error">
            No
          </Label>
        )}
      </TableCell>
      <TableCell>{row?.invitationDate || '—'}</TableCell>
      <TableCell>{row?.modifiedDate || '—'}</TableCell>
      <TableCell>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleResendEmail(row);
          }}
        >
          Resend Verification Email
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleEditSeller();
          }}
        >
          <Iconify icon="octicon:pencil-24" />
          Edit
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
    </TableRow>
  );
}
SellerRows.propTypes = {
  selected: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    ebayUsername: PropTypes.string.isRequired,
    eBayEmail: PropTypes.string.isRequired,
    isAuthorised: PropTypes.bool.isRequired,
    invitationDate: PropTypes.string.isRequired,
    modifiedDate: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
  }).isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
};
