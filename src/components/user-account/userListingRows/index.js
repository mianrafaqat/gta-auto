import PropTypes from 'prop-types';

import {
  TableRow,
  TableCell,
  MenuItem,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';

import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { format } from 'date-fns';
import Label from 'src/components/label/label';
import { useAuthContext } from 'src/auth/hooks';
import { useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { UserService } from 'src/services';
import { useSnackbar } from 'src/components/snackbar';

export default function UserListingRow({
  selected,
  row,
  onDeleteRow = () => {},
  ACCOUNT_TYPES,
  handleEditUser = () => {},
  setUpdateCount = () => {},
}) {
  const popover = usePopover();
  const enableDisablePopover = usePopover();

  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const confirm = useBoolean();
  const enableDisableConfirm = useBoolean();

  const accountType = ACCOUNT_TYPES.find((type) => type.id === row?.userAccountTypeId);

  const formattedDate = row?.createdDate ? format(new Date(row.createdDate), 'dd.MM.yyyy') : '';
  const lastLogin = row?.recentLogin ? format(new Date(row.recentLogin), 'dd.MM.yyyy') : '';

  const password = useBoolean();

  const { user = {} } = useAuthContext()?.user || {};

  const isUserActive = useMemo(() => {
    return row?.isActive;
  }, [row?.isActive]);

  console.log('🚀 ~ !isUserActive:', !isUserActive);

  const handleEnableOrDisableUser = async () => {
    try {
      setLoading(true);
      const data = {
        id: row?.id || '',
        status: !isUserActive ? 'UNBLOCKED' : 'BLOCKED',
      };
      console.log('🚀 ~ handleEnableOrDisableUser ~ data:', data);
      const res = await UserService.enableDisbledUser(data);
      if (res?.data?.status === '200') {
        enqueueSnackbar(res?.data?.description, {
          variant: 'success',
        });
        enableDisableConfirm.onFalse();
        setUpdateCount((prev) => prev + 1);
      }
    } catch (err) {
      enqueueSnackbar(err || 'An unknown error occcured!', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell>{row?.firstName || '—'}</TableCell>
      <TableCell>{row?.lastName || '—'}</TableCell>
      <TableCell sx={{ width: '170px' }}>
        <TextField
          size="small"
          type={password.value ? 'text' : 'password'}
          value={row?.planPass}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
      <TableCell>{lastLogin}</TableCell>
      <TableCell>{accountType ? accountType.name : 'N/A'}</TableCell>
      <TableCell>{row?.email}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        {row?.isActive ? (
          <Label variant="soft" color="success">
            Yes
          </Label>
        ) : (
          <Label variant="soft" color="error">
            No
          </Label>
        )}
      </TableCell>
      <TableCell>
        {row?.sellerAccount ? (
          row?.sellerAccount.isAuthorised ? (
            <Label variant="soft" color="success">
              Yes
            </Label>
          ) : (
            <Label variant="soft" color="error">
              No
            </Label>
          )
        ) : (
          '---'
        )}
      </TableCell>
      {/* <TableCell>
        <Tooltip title="Edit" placement="left">
          <Iconify icon="octicon:pencil-24" />
        </Tooltip>
      </TableCell> */}
      <TableCell>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleEditUser();
          }}
        >
          <Iconify icon="octicon:pencil-24" />
          Edit
        </MenuItem>
        {(user?.userAccountTypeId === 1 || user?.userAccountTypeId === 2) && (
          <MenuItem
            onClick={() => {
              enableDisableConfirm.onTrue();
              enableDisablePopover.onClose();
              popover.onClose();
            }}
          >
            <Iconify icon="fluent-mdl2:permissions" />
            {!isUserActive ? 'Enable User' : 'Disable User'}
          </MenuItem>
        )}
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
      <ConfirmDialog
        open={enableDisableConfirm.value}
        onClose={enableDisableConfirm.onFalse}
        title={!isUserActive ? 'Enable User' : 'Disable User'}
        content={`Are you sure want to ${!isUserActive ? 'enable' : 'disable'} this user?`}
        action={
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            onClick={handleEnableOrDisableUser}
          >
            {!isUserActive ? 'Enable User' : 'Disable User'}
          </LoadingButton>
        }
      />
    </TableRow>
  );
}
UserListingRow.propTypes = {
  selected: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    userAccountTypeId: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    createdDate: PropTypes.bool.isRequired,
    isActive: PropTypes.string.isRequired,
    sellerAccount: PropTypes.object.isRequired,
  }).isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
};
