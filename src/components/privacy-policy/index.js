import {
  Container,
  Divider,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <Container
      sx={{
        py: { xs: 2, md: 5 },
        textAlign: { xs: "center", md: "unset" },
      }}
    >
      <Typography mb={2} variant="h3">
        Privacy Policy
      </Typography>
      <Typography mb={2}>
        At GTA Auto, our top priority is keeping your information private. We
        gather, use, and safeguard your personal information when you use our
        mobile applications and website in accordance with this Privacy Policy.
        By accessing or using GTA Auto, you consent to the practices described
        in this Privacy Policy.
      </Typography>
      <Typography mb={2} variant="h3">
        Information We Collect:
      </Typography>
      <Typography mb={1}>
        When you use GTA Auto, we may gather a variety of information,
        including:
      </Typography>
      <List sx={{ pl: 5, listStyleType: "disc" }}>
        <ListItem sx={{ display: "list-item" }}>
          Your personal information, such as your name, contact information, and
          payment details.
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Details regarding the transactions and car preferences.
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Usage information, such as your browsing history and interactions with
          the platform.
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Details about your device, such as the operating system, browser type,
          and IP address.
        </ListItem>
      </List>
      <Typography mb={2} variant="h3">
        How We Use Your Information:
      </Typography>
      <Typography mb={1}>We utilize the data we collect to:</Typography>
      <List sx={{ pl: 5, listStyleType: "disc" }}>
        <ListItem sx={{ display: "list-item" }}>
          Enable transactions and customize your experience as part of our
          ongoing efforts to deliver and enhance our services.
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Communicate with you, respond to inquiries, and provide customer
          support.
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Analyze usage trends and patterns to improve GTA Auto' operations
          and efficiency.
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Comply with legal obligations and enforce our Terms and Conditions.
        </ListItem>
      </List>
      <Typography mb={1}>
        We take reasonable measures to guard against unauthorized access,
        alteration, disclosure, and destruction of your personal information.
        However, no method of transmission over the internet or electronic
        storage is entirely secure, so we cannot guarantee absolute security.
        Cookies and related tracking technologies are used by GTA Auto to
        enhance your online experience, examine usage trends, and show you
        relevant ads. Through the settings of your browser, you may control your
        cookie preferences. Links to external websites or services that are not
        run or governed by GTA Auto may be found on our platform. The content
        or privacy policies of these third parties are not our responsibility.
        We encourage you to review their privacy policies. GTA Auto does not
        knowingly collect personal information from children under the age of
        thirteen. Please get in touch with us right away if you are a parent or
        guardian and think your kid may have given us personal information. We
        keep your personal information for as long as it takes to fulfill the
        purposes outlined in this Privacy Policy, unless a longer retention time
        is required or authorized by law. We reserve the right to make changes
        to this policy at any time. Any modifications will take effect as soon
        as they are posted. You consent to the updated Privacy Policy if you use
        GTA Auto going forward.
      </Typography>
      <Typography mb={1}>
        If you have any questions or concerns about this Privacy Policy or our
        data practices, please contact us at{" "}
        <Link href="mailto:info@gtaAutos.co.uk">info@gtaAutos.co.uk</Link>
      </Typography>
      <Typography mb={2}>
        Thank you for trusting GTA Auto with your personal information. We're
        committed to protecting your privacy and providing you with a safe and
        secure experience on our platform.
      </Typography>
    </Container>
  );
}
