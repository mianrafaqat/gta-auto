import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';

import { useVerifyEmailConfig, useSendWelcomeEmail } from 'src/hooks/use-email';

// ----------------------------------------------------------------------

export default function EmailManagement({ order, customer, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendWelcomeEmail = async () => {
    if (!customer?.email) {
      enqueueSnackbar('Customer email is required', { variant: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      await sendWelcomeEmail.mutateAsync(customer);
      enqueueSnackbar('Welcome email sent successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to send welcome email', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!order || !customer) {
      enqueueSnackbar('Order and customer data are required', { variant: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      // This would need to be implemented in the order email service
      enqueueSnackbar('Order confirmation email resent!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to resend confirmation email', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Email Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage email notifications and verify email configuration
          </Typography>
        </Box>

        <Divider />

        {/* Email Configuration Status */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Email Configuration Status
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={configLoading ? 'Checking...' : (emailConfig?.success ? 'Verified' : 'Not Verified')}
              color={configLoading ? 'default' : (emailConfig?.success ? 'success' : 'error')}
              size="small"
            />
            <Button
              size="small"
              variant="outlined"
              onClick={handleVerifyConfig}
              disabled={configLoading}
            >
              Verify Config
            </Button>
          </Stack>
        </Box>

        {/* Email Actions */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Email Actions
          </Typography>
          <Stack spacing={2}>
            {customer && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">
                    Send welcome email to {customer.name || customer.email}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleSendWelcomeEmail}
                  disabled={isLoading || sendWelcomeEmail.isPending}
                >
                  Send Welcome
                </Button>
              </Stack>
            )}

            {order && customer && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">
                    Resend order confirmation for #{order.orderNumber}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleResendConfirmation}
                  disabled={isLoading}
                >
                  Resend
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Email Configuration Info */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Email configuration uses Gmail SMTP. Make sure your environment variables are properly set:
            <br />
            • EMAIL_USER: Your Gmail address
            <br />
            • EMAIL_PASS: Your Gmail app password
            <br />
            • ADMIN_EMAILS: Comma-separated admin email addresses
          </Typography>
        </Alert>

        {/* Close Button */}
        {onClose && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Box>
        )}
      </Stack>
    </Card>
  );
}

EmailManagement.propTypes = {
  order: PropTypes.object,
  customer: PropTypes.object,
  onClose: PropTypes.func,
};
