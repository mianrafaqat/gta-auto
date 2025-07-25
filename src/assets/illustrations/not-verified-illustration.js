import { memo } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import BackgroundShape from './background-shape';

// ----------------------------------------------------------------------

function NotVerifiedIllustration({ ...other }) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.ligh;
  const PRIMARY_DARK = theme.palette.primary.dark;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <BackgroundShape />

      <image href="/assets/illustrations/characters/character_6.png" height="300" x="205" y="30" />

      <path
        fill="#FFAB00"
        d="M111.1 141.2c58.7-1 58.6-88.3 0-89.2-58.6 1-58.6 88.3 0 89.2z"
        opacity="0.12"
      />

      <path fill="#FFD666" d="M111.1 120c30.8-.5 30.8-46.3 0-46.8-30.8.5-30.8 46.3 0 46.8z" />

      <defs>
        <linearGradient
          id="paint0_linear_1_119"
          x1="78.3"
          x2="78.3"
          y1="187.77"
          y2="305.935"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>
      </defs>
    </Box>
  );
}

export default memo(NotVerifiedIllustration);
