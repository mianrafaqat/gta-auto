'use client';

import { m } from 'framer-motion';

import Typography from '@mui/material/Typography';
import CompactLayout from 'src/layouts/compact';
import { NotVerifiedIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

export default function FailurePage() {
  const message =
    'Due to some unknown reasons, your account is not verified successfully. You can try again with the link sent to your email.';

  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Ebay Account Verification
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>{message}</Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <NotVerifiedIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </MotionContainer>
    </CompactLayout>
  );
}
