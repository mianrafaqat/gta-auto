"use client";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

import { useCountdownDate } from "src/hooks/use-countdown";

import { _socials } from "src/_mock";
import { ComingSoonIllustration } from "src/assets/illustrations";

import Iconify from "src/components/iconify";
import { Container, Grid, Link } from "@mui/material";
import Image from "src/components/image";

import { useMediaQuery } from "@mui/material";

// ----------------------------------------------------------------------

export default function ComingSoonView() {
  const { days, hours, minutes, seconds } = useCountdownDate(
    new Date("03/20/2024 00:00")
  );

  const isMediumUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <>
      <Grid
        container
        sx={{ justifyContent: "space-between", mt: 0, paddingTop: 0 }}>
        <Grid item md={6} sx={{ padding: { xs: 2, sm: 2, md: 2 } }}>
          <Box>
            <Box>
              <Image width="150px" src={`/assets/logo.png`} />
              <Typography
                variant="p"
                sx={{
                  display: "block",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}>
                We are digging deep down
              </Typography>
              <Typography variant="body1" sx={{ color: "#898989", mt: 1 }}>
                Exciting News! Our website is currently under construction to
                bring you an even better experience. In the meantime, you can
                still access all our services through our mobile app available
                on Google Play and the App Store. Stay tuned for updates, and
                thank you for your patience! For any urgent matters, reach out
                to us at{" "}
                <Link
                  sx={{ color: "#4caf50" }}
                  href="mailto:support@garagetunedautos.com">
                  support@garagetunedautos.com
                </Link>
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: "24px",
                  mt: {
                    xs: 3,
                    md: 5,
                  },
                }}>
                <TimeBox number={days} text="days" />
                <TimeBox bg="#4caf50" number={hours} text="hrs" />
                <TimeBox bg="#4caf50" number={minutes} text="mins" />
              </Box>
            </Box>
            <Box mt={2} sx={{ display: "flex", gap: 1, mt: 5 }}>
              <Link
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.render.gtaAutos">
                <img
                  width={128}
                  height={42}
                  src="/assets/stores/google-play-store.jpg"
                  alt="Google Play Store"
                  sx={{ display: "flex" }}
                />
              </Link>
              <Link
                target="_blank"
                href="https://apps.apple.com/us/app/city-autos/id1673149735">
                <img
                  width={128}
                  height={42}
                  src="/assets/stores/app-store.jpg"
                  alt="App Store"
                  sx={{ display: "flex" }}
                />
              </Link>
            </Box>
          </Box>
        </Grid>
        {isMediumUp && (
          <Grid item md={6} sx={{ display: "flex", justifyContent: "end" }}>
            <Image height="600px" src="/assets/under-construction.png" />
          </Grid>
        )}
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#f5f5f5", // Change this to your desired background color
          padding: { xs: 2, sm: 2, md: 2 },
          textAlign: "center",
        }}>
        <Typography variant="caption">
          © Copyrights GTA Auto | All Rights Reserved | 2024
        </Typography>
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

function TimeBlock({ label, value }) {
  return (
    <div>
      <Box sx={{ color: "white" }}> {value} </Box>
      <Box sx={{ color: "#4caf50", fontWeight: 600, fontSize: "1rem" }}>
        {label}
      </Box>
    </div>
  );
}

const TimeBox = ({ bg = "#140000", number = 0, text = "" }) => {
  return (
    <Box
      sx={{
        width: "80px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        borderRadius: "10px",
      }}>
      <Box
        xs={{
          display: "flex",
          flexDirection: "column",
        }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            color: "white",
            borderBottom: "1px solid #fff",
          }}>
          {number}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "white", textAlign: "center" }}
          mt={1}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};
