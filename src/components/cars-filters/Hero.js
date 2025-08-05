"use client";
import { Box, Container, Typography } from "@mui/material";
import React from "react";
import MuxPlayer from "@mux/mux-player-react";
import SearchByModels from "./search-by-models";

const Hero = () => {
  return (
    <Container
      sx={{
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        minHeight: 630,
        position: "relative",
        // overflow: 'hidden',
      }}
      maxWidth="xl">
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          "& > *": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
          },
        }}>
        <MuxPlayer
          playbackId="9WU2Y5OXCT56CzULR8mFAhmKPwJshaP66G902lnvKyek"
          autoPlay
          muted
          controls={false}
          loop
          streamType="on-demand"
          style={{
            height: "100%",
            width: "100vw",
            objectFit: "cover",
            // borderRadius: '12px',
            "--media-object-fit": "cover",
            "--media-object-position": "center",
            "--controls": "none",
            "--media-control-display": "none",
            "& mux-player": {
              "--controls": "none !important",
            },
            pointerEvents: "none",
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          textAlign: "center",
          // width: '100%'
        }}>
        <Box
          component="img"
          src="/assets/logo.webp"
          alt="Logo"
          sx={{
            width: { xs: "200px", sm: "250px", md: "300px" },
            height: "auto",
            marginBottom: 3,
          }}
        />
        <Typography
          variant="h2"
          sx={{
            color: "#fff",
            fontWeight: 700,
            textTransform: "uppercase",
            animation: "fadeInOut 2s infinite",
            "@keyframes fadeInOut": {
              "0%": { opacity: 0.4 },
              "50%": { opacity: 1 },
              "100%": { opacity: 0.4 },
            },
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
          }}>
          Coming Soon
        </Typography>
      </Box>
      <Box
        p={3}
        sx={{
          zIndex: 999,
          borderRadius: "12px",
          marginBottom: 0,
          maxWidth: {
            sm: "95%",
            md: "80%",
            lg: "100%",
          },
          width: "90%",
          background: "#fff",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          position: "relative",
          zIndex: 1,
          mb: "-50px",
          display: { xs: "none", md: "block" },
        }}>
        <Box mt={2}>
          <SearchByModels />
        </Box>
      </Box>
    </Container>
  );
};

export default Hero;
