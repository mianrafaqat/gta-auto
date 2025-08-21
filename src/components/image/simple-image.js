import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const SimpleImage = forwardRef(
  (
    {
      alt,
      src,
      overlay,
      ratio,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const overlayStyles = !!overlay && {
      '&:before': {
        content: "''",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 1,
        position: 'absolute',
        background: overlay || alpha(theme.palette.grey[900], 0.48),
      },
    };

    const content = (
      <Box
        component="img"
        alt={alt}
        src={src}
        sx={{
          width: 1,
          height: 1,
          objectFit: 'cover',
          verticalAlign: 'bottom',
          ...(!!ratio && {
            top: 0,
            left: 0,
            position: 'absolute',
          }),
        }}
      />
    );

    return (
      <Box
        ref={ref}
        component="span"
        className="component-image"
        sx={{
          overflow: 'hidden',
          position: 'relative',
          verticalAlign: 'bottom',
          display: 'inline-block',
          ...(!!ratio && {
            width: 1,
            pt: ratio === '4/3' ? '75%' : 
                ratio === '3/4' ? '133.33%' : 
                ratio === '6/4' ? '66.67%' : 
                ratio === '4/6' ? '150%' : 
                ratio === '16/9' ? '56.25%' : 
                ratio === '9/16' ? '177.78%' : 
                ratio === '21/9' ? '42.86%' : 
                ratio === '9/21' ? '233.33%' : 
                ratio === '1/1' ? '100%' : '100%',
          }),
          ...overlayStyles,
          ...sx,
        }}
        {...other}
      >
        {content}
      </Box>
    );
  }
);

SimpleImage.propTypes = {
  alt: PropTypes.string,
  overlay: PropTypes.string,
  ratio: PropTypes.oneOf(['4/3', '3/4', '6/4', '4/6', '16/9', '9/16', '21/9', '9/21', '1/1']),
  src: PropTypes.string,
  sx: PropTypes.object,
};

export default SimpleImage;
