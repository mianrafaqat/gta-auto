import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import Header from '../common/header-simple';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function CompactLayout({
  children,
  hideNav = false,
  maxWidth = '',
  sx = {},
  stackSX = {},
}) {
  return (
    <Box sx={{ ...sx }}>
      {!hideNav && <Header />}

      {/* <Container component="main"> */}
      <Stack
        sx={{
          py: 1,
          m: 'auto',
          maxWidth: maxWidth ? maxWidth : 500,
          minHeight: '100vh',
          justifyContent: 'center',
          ...stackSX,
        }}
      >
        {children}
      </Stack>
      {/* </Container> */}
    </Box>
  );
}

CompactLayout.propTypes = {
  children: PropTypes.node,
};
