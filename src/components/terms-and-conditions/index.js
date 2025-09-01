import {
  Box,
  Container,
  Link,
  Typography,
  Divider,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import React from "react";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import GavelIcon from "@mui/icons-material/Gavel";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import UpdateIcon from "@mui/icons-material/Update";
import EmailIcon from "@mui/icons-material/Email";

export default function TermsAndConditions() {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 8 },
        textAlign: { xs: "center", md: "unset" },
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 5 },
          background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
          borderRadius: 4,
        }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <DirectionsCarFilledIcon
            sx={{ fontSize: 48, color: "#4caf50", mr: 1 }}
          />
          <Typography variant="h3" color="#fff" fontWeight={700}>
            Terms and Conditions
          </Typography>
        </Box>
        <Typography
          mb={3}
          color="#fff"
          variant="subtitle1"
          sx={{ textAlign: "center" }}>
          Welcome to <b> Garage Tuned Autos</b>! Please review our Terms &
          Conditions before using our platform.
        </Typography>
        <Divider sx={{ mb: 3, bgcolor: "#4caf50" }} />
        <List sx={{ color: "#fff", pl: 3, mb: 3 }}>
          <ListItem sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <GavelIcon sx={{ color: "#4caf50", mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="h6" color="#4caf50">
                Acceptance of Terms
              </Typography>
              <Typography variant="body2">
                By accessing or using Garage Tuned Autos (<b>gtaAutos.co.uk</b>)
                or our mobile apps, you agree to these Terms and Conditions. If
                you do not agree, please do not use our services.
              </Typography>
            </Box>
          </ListItem>
          <ListItem sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <VerifiedUserIcon sx={{ color: "#4caf50", mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="h6" color="#4caf50">
                Platform Integrity & Safety
              </Typography>
              <Typography variant="body2">
                All vehicles listed on Garage Tuned Autos comply with current
                industry regulations. Our apps are compatible with iOS and
                Android, so you can buy and sell with confidence—anywhere,
                anytime.
              </Typography>
            </Box>
          </ListItem>
          <ListItem sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <DirectionsCarFilledIcon
              sx={{ color: "#4caf50", mr: 2, mt: 0.5 }}
            />
            <Box>
              <Typography variant="h6" color="#4caf50">
                User Responsibilities
              </Typography>
              <Typography variant="body2">
                Use Garage Tuned Autos responsibly and ethically. Provide
                accurate information, follow all applicable laws, and respect
                other users. Intellectual property (logos, trademarks, content)
                is protected—do not use without written consent.
              </Typography>
            </Box>
          </ListItem>
          <ListItem sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <UpdateIcon sx={{ color: "#4caf50", mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="h6" color="#4caf50">
                Service Availability & Changes
              </Typography>
              <Typography variant="body2">
                We strive for a reliable platform, but cannot guarantee
                uninterrupted service. Garage Tuned Autos is not liable for any
                losses or damages from use. Terms may change at any time;
                continued use means acceptance of updates.
              </Typography>
            </Box>
          </ListItem>
          <ListItem sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <GavelIcon sx={{ color: "#4caf50", mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="h6" color="#4caf50">
                Governing Law
              </Typography>
              <Typography variant="body2">
                These Terms and Conditions are governed by the laws of the
                United Kingdom. UK courts have exclusive jurisdiction over
                disputes.
              </Typography>
            </Box>
          </ListItem>
        </List>
        <Divider sx={{ mb: 3, bgcolor: "#4caf50" }} />
        <Typography color="#fff" sx={{ mb: 2, textAlign: "center" }}>
          Thank you for choosing <b> Garage Tuned Autos</b> as your online
          vehicle marketplace.
          <br />
          <Box
            component="span"
            sx={{ display: "inline-flex", alignItems: "center", mt: 1 }}>
            <EmailIcon sx={{ color: "#4caf50", mr: 1 }} />
            <Link
              href="mailto:support@garagetunedautos.com"
              underline="hover"
              color="#4caf50"
              fontWeight={600}
              sx={{ fontSize: "1.1rem" }}>
              support@garagetunedautos.com
            </Link>
          </Box>
        </Typography>
      </Paper>
    </Container>
  );
}
