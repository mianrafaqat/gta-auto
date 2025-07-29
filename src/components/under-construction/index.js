'use client';

import React from 'react';
import { useSettingsContext } from '../settings';
import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { SeoIllustration } from 'src/assets/illustrations';
import { m } from 'framer-motion';

import { varBounce, MotionContainer } from 'src/components/animate';
import { useCountdownDate } from 'src/hooks/use-countdown';

export default function UnderConstructionPage() {
  const settings = useSettingsContext();

  const { days, hours, minutes, seconds } = useCountdownDate(new Date('07/07/2024 21:30'));

  return (
    <MotionContainer>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Coming Soon!
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        Exciting News! Our website is currently under construction to bring you an even better
        experience. In the meantime, you can still access all our services through our mobile app
        available on Google Play and the App Store. Stay tuned for updates, and thank you for your
        patience! For any urgent matters, reach out to us at &nbsp;
        <Link href="mailto:info@gtaAutos.co.uk">info@gtaAutos.co.uk</Link>
      </Typography>
      <Stack
        direction="row"
        justifyContent="center"
        divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
        sx={{ typography: 'h2' }}
      >
        <TimeBlock label="Days" value={days} />

        <TimeBlock label="Hours" value={hours} />

        <TimeBlock label="Minutes" value={minutes} />

        <TimeBlock label="Seconds" value={seconds} />
      </Stack>
      <Box
        sx={{
          p: 1,
          pt: 2,
          md: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
          lg: {
            position: 'absolute',
            top: '40%',
            left: '40%',
            transform: 'translate(-40%, -40%)',
          },
        }}
      >
        <Grid alignItems="center" container spacing={5}>
          <Grid item xs={12} md={6} order={{ xs: 2, sm: 2, md: 1 }}>
            <Typography variant="h3"></Typography>
            <Typography variant="body1">
              <Grid mt={1} container spacing={1}>
                <Grid item xs={12} md={6} lg={4}>
                  <m.div variants={varBounce().in}>
                    <Link
                      target="_blank"
                      href="https://play.google.com/store/apps/details?id=com.render.gtaAutos"
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <img
                        width={128}
                        height={42}
                        src="/assets/stores/google-play-store.jpg"
                        alt=""
                      />
                    </Link>
                  </m.div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <m.div variants={varBounce().in}>
                    <Link
                      target="_blank"
                      href="https://apps.apple.com/us/app/city-autos/id1673149735"
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <img width={128} height={42} src="/assets/stores/app-store.jpg" alt="" />
                    </Link>
                  </m.div>
                </Grid>
              </Grid>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, sm: 1, md: 2 }}>
            <m.div variants={varBounce().in}>
              <SeoIllustration
                sx={{
                  // sx: {
                  //   height: 800,
                  // },
                  // sm: {
                  //   height: '100%',
                  // },
                  md: {
                    height: 500,
                  },
                  // my: { xs: 5, sm: 10 },
                }}
              />
            </m.div>
          </Grid>
        </Grid>
      </Box>
    </MotionContainer>
  );
}

function TimeBlock({ label, value }) {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}
