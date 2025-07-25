import { Box, Container, Link, Typography } from "@mui/material";
import React from "react";

export default function TermsAndConditions() {
  return (
    <Container
      sx={{
        py: { xs: 2, md: 5 },
        textAlign: { xs: "center", md: "unset" },
      }}
    >
      <Typography mb={2} variant="h3">
        Terms and Conditions
      </Typography>
      <Typography sx={{textAlign: 'justify'}}>
        Welcome to City Autos! Our goal is to become the leading online vehicle
        marketplace in the UK, bringing together new and used car buyers and
        sellers. Please take a moment to read over the following Terms &
        Conditions before you start using our platform. You accept these Terms
        and Conditions by accessing or using City Autos (cityautos.co.uk) or our
        mobile applications. If you don't agree with any part of these terms,
        please refrain from using our services. All vehicles listed on City
        Autos are complies completely with current industry regulations. You can
        purchase or sell with confidence knowing that the cars meet the required
        standards. Our mobile applications are compatible with iOS and Android
        devices, so you can easily use City Autos on them. Everywhere you go,
        carry the marketplace with you. We're dedicated to making your City
        Autos purchasing and selling experiences better. Our team is committed
        to developing the safest and most reliable platform possible. We're
        always looking for ways to improve, so your feedback is invaluable to
        us. As a user of City Autos, you agree to use our platform responsibly
        and ethically. This includes providing correct information, abide by all
        relevant rules and laws, and showing respect for other people. The
        content and materials on City Autos, including logos and trademarks, are
        protected by intellectual property laws. Without our express written
        consent, you are not permitted to use our intellectual property.
        Although we work hard to offer a dependable platform, we cannot
        guarantee that City Autos will never experience an issue or be
        unavailable at all. You acknowledge that City Autos will not be
        responsible for any losses or damages resulting from your usage of the
        platform by using our services. These Terms and Conditions could be
        changed at any time. Any modifications will take effect as soon as they
        are posted. Acceptance of the updated terms is indicated by your
        continued usage of City Autos. These Terms and Conditions are governed
        by the laws of the United Kingdom. The courts in the United Kingdom
        shall have exclusive jurisdiction over any disputes arising out of or
        pertaining to these agreements. Thank you for choosing City Autos as
        your online vehicle marketplace. If you have any questions or concerns
        about these Terms and Conditions, please don't hesitate to contact us at <Link href="mailto:info@cityautos.co.uk">info@cityautos.co.uk</Link>.
      </Typography>
    </Container>
  );
}
