import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'garagetunedautos01@gmail.com ',
      pass: process.env.EMAIL_PASS, // App password for Gmail
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email configuration
export const emailConfig = {
  from: {
    name: 'Garage Tuned Autos',
    address: process.env.EMAIL_USER || 'garagetunedautos01@gmail.com'
  },
  adminEmails: process.env.ADMIN_EMAILS ? 
    process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) : 
    ['garagetunedautos01@gmail.com'],
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3033'
};

// Send email function
export const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  try {
    console.log('Sending email to:', to, 'subject:', subject, 'html:', html, 'text:', text);
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.address}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text,
      attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return { success: true };
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return { success: false, error: error.message };
  }
};

export default { sendEmail, verifyEmailConfig, emailConfig };
