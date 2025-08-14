import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function AddressItem({ address, action, sx, ...other }) {
  // Handle both old and new address structures
  const { 
    name, 
    fullAddress, 
    addressType, 
    phoneNumber, 
    primary,
    email,
    company,
    address1,
    address2,
    city,
    state,
    postcode,
    country
  } = address;

  // Generate fullAddress if not provided (for backward compatibility)
  const displayAddress = fullAddress || `${address1}${address2 ? `, ${address2}` : ''}, ${city}, ${state}, ${postcode}, ${country}`;

  return (
    <Stack
      component={Paper}
      spacing={2}
      alignItems={{ md: 'flex-end' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
          <Typography variant="subtitle2">
            {name}
            <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
              ({addressType})
            </Box>
          </Typography>

          {primary && (
            <Label color="info" sx={{ ml: 1 }}>
              Default
            </Label>
          )}
        </Stack>

        {email && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {email}
          </Typography>
        )}

        {company && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {company}
          </Typography>
        )}

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {displayAddress}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {phoneNumber}
        </Typography>
      </Stack>

      {action && action}
    </Stack>
  );
}

AddressItem.propTypes = {
  action: PropTypes.node,
  address: PropTypes.object,
  sx: PropTypes.object,
};
