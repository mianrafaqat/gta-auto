'use client';

import PropTypes from 'prop-types';

import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return children;
}

Layout.propTypes = {
  children: PropTypes.node,
};
