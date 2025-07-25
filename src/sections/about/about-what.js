import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { useResponsive } from 'src/hooks/use-responsive';

import { fPercent } from 'src/utils/format-number';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export const SKILLS = [...Array(3)].map((_, index) => ({
  label: ['Development', 'Design', 'Marketing'][index],
  value: [20, 40, 60][index],
}));

// ----------------------------------------------------------------------

export default function OurVision() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const lightMode = theme.palette.mode === 'light';

  const shadow = `-40px 40px 80px ${alpha(
    lightMode ? theme.palette.grey[500] : theme.palette.common.black,
    0.24
  )}`;

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 2, md: 5 },
        textAlign: { xs: 'center', md: 'unset' },
      }}
    >
      <Grid container columnSpacing={{ md: 3 }} alignItems="center">
        {mdUp && (
          <Grid container xs={12} md={4} lg={6} alignItems="center" sx={{ pr: { md: 7 } }}>
            <Grid xs={12}>
              <m.div variants={varFade().inUp}>
                <Image
                  alt="our office 2"
                  src="/assets/images/about/car-car-park.jpg"
                  ratio="16/9"
                
                  sx={{ borderRadius: 3, boxShadow: shadow,ObjectFit:'cover' }}
                />
              </m.div>
            </Grid>

          
          </Grid>
        )}

        <Grid xs={12} md={8} lg={6}>
          <m.div variants={varFade().inRight}>
            <Typography variant="h2" sx={{ mb: 3 }}>
            Our Vision 
                        </Typography>
          </m.div>

          <m.div variants={varFade().inRight}>
            <Typography
              sx={{
                color: theme.palette.mode === 'light' ? 'text.secondary' : 'common.white',
              }}
            >
              Our vision is to become the leading online vehicle marketplace in the UK. We are starting a journey
where purchasers of new and used cars or selling your car. All vehicles are fully compliant and adhere to
current industry standard regulations.
<br/>
<br/>
We are continuously improving purchasing and selling experiences, and developing the safest and
reliable platform. We are incredibly proud of our incredible teams that are constantly transforming the
automotive industry. 
            </Typography>
          </m.div>

       

         
        </Grid>
      </Grid>
    </Container>
    // </Box>
  );
}


