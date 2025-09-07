import { useMutation, useQuery } from "@tanstack/react-query";
import OrderEmailService from "src/services/orders/orderEmail.service";

/**
 * Hook for sending order confirmation email
 */
export function useSendOrderConfirmationEmail() {
  return useMutation({
    mutationFn: ({ order, customer }) => 
      OrderEmailService.sendOrderConfirmationEmail(order, customer),
    onError: (error) => {
      console.error('Failed to send order confirmation email:', error);
    },
  });
}

/**
 * Hook for sending admin notification email
 */
export function useSendAdminNotificationEmail() {
  return useMutation({
    mutationFn: ({ order, customer }) => 
      OrderEmailService.sendAdminNotificationEmail(order, customer),
    onError: (error) => {
      console.error('Failed to send admin notification email:', error);
    },
  });
}

/**
 * Hook for sending order status update email
 */
export function useSendOrderStatusUpdateEmail() {
  return useMutation({
    mutationFn: ({ order, newStatus, note }) => 
      OrderEmailService.sendOrderStatusUpdateEmail(order, newStatus, note),
    onError: (error) => {
      console.error('Failed to send order status update email:', error);
    },
  });
}

/**
 * Hook for resending order confirmation email
 */
export function useResendOrderConfirmationEmail() {
  return useMutation({
    mutationFn: ({ orderId, order, customer }) => 
      OrderEmailService.resendOrderConfirmationEmail(orderId, order, customer),
    onError: (error) => {
      console.error('Failed to resend order confirmation email:', error);
    },
  });
}

/**
 * Hook for sending welcome email
 */
export function useSendWelcomeEmail() {
  return useMutation({
    mutationFn: (customer) => 
      OrderEmailService.sendWelcomeEmail(customer),
    onError: (error) => {
      console.error('Failed to send welcome email:', error);
    },
  });
}

/**
 * Hook for verifying email configuration
 */
export function useVerifyEmailConfig() {
  return useQuery({
    queryKey: ["email", "config"],
    queryFn: () => OrderEmailService.verifyEmailConfig(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for sending both order confirmation and admin notification emails
 * This is useful for order creation flow
 */
export function useSendOrderEmails() {
  const sendOrderConfirmation = useSendOrderConfirmationEmail();
  const sendAdminNotification = useSendAdminNotificationEmail();

  return useMutation({
    mutationFn: async ({ order, customer }) => {
      const results = {
        confirmation: null,
        adminNotification: null,
        errors: []
      };

      // Send order confirmation email
      try {
        results.confirmation = await OrderEmailService.sendOrderConfirmationEmail(order, customer);
      } catch (error) {
        results.errors.push({ type: 'confirmation', error: error.message });
      }

      // Send admin notification email
      try {
        results.adminNotification = await OrderEmailService.sendAdminNotificationEmail(order, customer);
      } catch (error) {
        results.errors.push({ type: 'adminNotification', error: error.message });
      }

      return results;
    },
    onError: (error) => {
      console.error('Failed to send order emails:', error);
    },
  });
}
