import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function AboutHero() {
  return (
    <Box
      sx={{
        height: { md: 460 },
        py: { xs: 10, md: 0 },
        overflow: 'hidden',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage:
          'url(/assets/background/overlay_1.svg), url(/assets/images/about/car-car-park.jpg)',
      }}
    >
      <Container component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: {
              xs: 'center',
              md: 'unset',
            },
          }}
        >
          <Stack spacing={2} display="inline-flex" direction="row" >
          <TextAnimate text="Find 
" variants={varFade().inRight} sx={{ color: 'primary.main' }} />
          <TextAnimate text="a  
" variants={varFade().inRight} sx={{ color: 'primary.main' }} />
          <TextAnimate text="great 
" variants={varFade().inRight} sx={{ color: 'primary.main' }} />
          <TextAnimate text="deal...  
" variants={varFade().inRight} sx={{ color: 'primary.main' }} />
         </Stack>

          <br />

          <Stack spacing={2} display="inline-flex" direction="row" sx={{ color: 'common.white' }}>
            <TextAnimate text="and " />
            <TextAnimate text="so  " />
            <TextAnimate text="much  " />
            <TextAnimate text="more " />
          </Stack>

          <m.div variants={varFade().inRight}>
            <Typography
              variant="h4"
              sx={{
                mt: 3,
                color: 'common.white',
                fontWeight: 'fontWeightSemiBold',
              }}
            >
              {/* Let&apos;s work together and
              <br /> make awesome site easily */}
            </Typography>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function TextAnimate({ text, variants, sx, ...other }) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h1',
        overflow: 'hidden',
        display: 'inline-flex',
        ...sx,
        fontSize: {
          xs: "30px",
          md: '50px'
        }
      }}
      
      {...other}
      
    >
      {text.split('').map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}

TextAnimate.propTypes = {
  sx: PropTypes.object,
  text: PropTypes.string,
  variants: PropTypes.object,
};
