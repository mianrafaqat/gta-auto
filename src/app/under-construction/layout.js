'use client';

import PropTypes from 'prop-types';

import CompactLayout from 'src/layouts/compact';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <CompactLayout
      sx={{
        pt: 0,
      }}
      stackSX={{
        minHeight: '100%',
        pt: 0,
      }}
      maxWidth="100%"
      hideNav
    >
      {children}
    </CompactLayout>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
