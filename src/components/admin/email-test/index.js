import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

import { useSnackbar } from 'src/components/snackbar';
import { useVerifyEmailConfig, useSendWelcomeEmail } from 'src/hooks/use-email';

// ----------------------------------------------------------------------

export default function EmailTest() {
  const { enqueueSnackbar } = useSnackbar();
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');

  const { data: emailConfig, isLoading: configLoading, refetch: verifyConfig } = useVerifyEmailConfig();
  const sendWelcomeEmail = useSendWelcomeEmail();

  const handleVerifyConfig = async () => {
    try {
      await verifyConfig();
      enqueueSnackbar('Email configuration verified successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Email configuration verification failed', { variant: 'error' });
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      enqueueSnackbar('Please enter a test email address', { variant: 'error' });
      return;
    }

    try {
      await sendWelcomeEmail.mutateAsync({
        name: testName || 'Test User',
        email: testEmail
      });
      enqueueSnackbar('Test email sent successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to send test email', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Email System Test
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Test your email configuration and send test emails
          </Typography>
        </Box>

        <Divider />

        {/* Email Configuration Status */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Email Configuration Status
          </Typography>
          <Stack spacing={2}>
            <Alert 
              severity={configLoading ? 'info' : (emailConfig?.success ? 'success' : 'error')}
              action={
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleVerifyConfig}
                  disabled={configLoading}
                >
                  {configLoading ? <CircularProgress size={16} /> : 'Verify'}
                </Button>
              }
            >
              {configLoading 
                ? 'Checking email configuration...' 
                : (emailConfig?.success 
                  ? 'Email configuration is working correctly' 
                  : 'Email configuration failed - check your environment variables')
              }
            </Alert>
          </Stack>
        </Box>

        {/* Test Email */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Send Test Email
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Test Email Address"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              fullWidth
            />
            <TextField
              label="Test Name (Optional)"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Test User"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSendTestEmail}
              disabled={!testEmail || sendWelcomeEmail.isPending}
              startIcon={sendWelcomeEmail.isPending ? <CircularProgress size={16} /> : null}
            >
              {sendWelcomeEmail.isPending ? 'Sending...' : 'Send Test Email'}
            </Button>
          </Stack>
        </Box>

        {/* Instructions */}
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Setup Instructions:</strong>
            <br />
            1. Create a <code>.env.local</code> file in your project root
            <br />
            2. Add your Gmail credentials:
            <br />
            • EMAIL_USER=your-gmail@gmail.com
            <br />
            • EMAIL_PASS=your-app-password
            <br />
            • ADMIN_EMAILS=admin@example.com,support@example.com
            <br />
            3. Make sure 2FA is enabled on your Gmail account
            <br />
            4. Generate an App Password for this application
          </Typography>
        </Alert>
      </Stack>
    </Card>
  );
}
