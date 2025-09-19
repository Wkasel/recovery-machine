// Payment email templates and sending service
// Recovery Machine - Email notifications

import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Email templates
export interface PaymentEmailData {
  customerEmail: string;
  customerName?: string;
  orderId: string;
  amount: number;
  transactionId?: string;
  subscriptionId?: string;
  setupFeeAmount?: number;
  orderType: 'subscription' | 'one_time' | 'setup_fee';
}

export function generatePaymentConfirmationEmail(data: PaymentEmailData): string {
  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const orderTypeText = {
    subscription: 'Monthly Subscription',
    setup_fee: 'Setup Fee',
    one_time: 'One-time Payment',
  }[data.orderType];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation - Recovery Machine</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; }
        .details { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Confirmation</h1>
          <p>Recovery Machine</p>
        </div>
        
        <div class="content">
          <h2>Thank you for your payment!</h2>
          
          <p>Hi ${data.customerName || 'there'},</p>
          
          <p>We've successfully processed your payment for Recovery Machine services.</p>
          
          <div class="details">
            <h3>Payment Details</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Payment Type:</strong> ${orderTypeText}</p>
            <p><strong>Amount:</strong> <span class="amount">${formatAmount(data.amount)}</span></p>
            ${data.setupFeeAmount ? `<p><strong>Setup Fee:</strong> ${formatAmount(data.setupFeeAmount)}</p>` : ''}
            ${data.transactionId ? `<p><strong>Transaction ID:</strong> ${data.transactionId}</p>` : ''}
            ${data.subscriptionId ? `<p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>` : ''}
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          ${data.orderType === 'subscription' ? `
            <h3>Your Subscription</h3>
            <p>Your monthly subscription is now active! You can now book recovery sessions through your dashboard.</p>
            <p><strong>Monthly Amount:</strong> ${formatAmount(40000)}</p>
            <p><strong>Next Billing Date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          ` : ''}
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
            View Dashboard
          </a>
          
          <h3>What's Next?</h3>
          <ul>
            <li>Log in to your dashboard to schedule your first session</li>
            <li>Choose from our available time slots</li>
            <li>Prepare your space for the ultimate recovery experience</li>
          </ul>
          
          <p>If you have any questions, please contact our support team at <a href="mailto:support@recoverymachine.com">support@recoverymachine.com</a>.</p>
        </div>
        
        <div class="footer">
          <p>Recovery Machine | Premium Recovery Services</p>
          <p>This is an automated confirmation email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateRefundNotificationEmail(data: {
  customerEmail: string;
  customerName?: string;
  orderId: string;
  refundAmount: number;
  refundReason?: string;
}): string {
  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Refund Processed - Recovery Machine</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .amount { font-size: 24px; font-weight: bold; color: #dc2626; }
        .details { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Refund Processed</h1>
          <p>Recovery Machine</p>
        </div>
        
        <div class="content">
          <h2>Your refund has been processed</h2>
          
          <p>Hi ${data.customerName || 'there'},</p>
          
          <p>We've processed your refund request. The refund amount will appear in your original payment method within 3-5 business days.</p>
          
          <div class="details">
            <h3>Refund Details</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Refund Amount:</strong> <span class="amount">${formatAmount(data.refundAmount)}</span></p>
            ${data.refundReason ? `<p><strong>Reason:</strong> ${data.refundReason}</p>` : ''}
            <p><strong>Processed Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>If you have any questions about this refund, please contact our support team at <a href="mailto:support@recoverymachine.com">support@recoverymachine.com</a>.</p>
          
          <p>We're sorry to see you go and hope to serve you again in the future.</p>
        </div>
        
        <div class="footer">
          <p>Recovery Machine | Premium Recovery Services</p>
          <p>This is an automated notification email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateSubscriptionCancelledEmail(data: {
  customerEmail: string;
  customerName?: string;
  subscriptionId: string;
  lastBillingDate: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Cancelled - Recovery Machine</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .details { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Subscription Cancelled</h1>
          <p>Recovery Machine</p>
        </div>
        
        <div class="content">
          <h2>Your subscription has been cancelled</h2>
          
          <p>Hi ${data.customerName || 'there'},</p>
          
          <p>We've processed your subscription cancellation request. Your subscription will remain active until your current billing period ends.</p>
          
          <div class="details">
            <h3>Cancellation Details</h3>
            <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
            <p><strong>Last Billing Date:</strong> ${data.lastBillingDate}</p>
            <p><strong>Service Ends:</strong> ${new Date(new Date(data.lastBillingDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p><strong>Cancelled Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>You can continue to use our services until your current billing period ends. After that, you'll need to resubscribe to access our services again.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
            Reactivate Subscription
          </a>
          
          <p>If you cancelled by mistake or would like to discuss your experience, please contact our support team at <a href="mailto:support@recoverymachine.com">support@recoverymachine.com</a>.</p>
          
          <p>We're sorry to see you go and hope to serve you again in the future.</p>
        </div>
        
        <div class="footer">
          <p>Recovery Machine | Premium Recovery Services</p>
          <p>This is an automated notification email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email sending functions
export async function sendPaymentConfirmationEmail(data: PaymentEmailData): Promise<boolean> {
  try {
    const htmlContent = generatePaymentConfirmationEmail(data);

    await transporter.sendMail({
      from: `"Recovery Machine" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject: 'Payment Confirmation - Recovery Machine',
      html: htmlContent,
    });

    console.log('Payment confirmation email sent to:', data.customerEmail);
    return true;

  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    return false;
  }
}

export async function sendRefundNotificationEmail(data: {
  customerEmail: string;
  customerName?: string;
  orderId: string;
  refundAmount: number;
  refundReason?: string;
}): Promise<boolean> {
  try {
    const htmlContent = generateRefundNotificationEmail(data);

    await transporter.sendMail({
      from: `"Recovery Machine" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject: 'Refund Processed - Recovery Machine',
      html: htmlContent,
    });

    console.log('Refund notification email sent to:', data.customerEmail);
    return true;

  } catch (error) {
    console.error('Failed to send refund notification email:', error);
    return false;
  }
}

export async function sendSubscriptionCancelledEmail(data: {
  customerEmail: string;
  customerName?: string;
  subscriptionId: string;
  lastBillingDate: string;
}): Promise<boolean> {
  try {
    const htmlContent = generateSubscriptionCancelledEmail(data);

    await transporter.sendMail({
      from: `"Recovery Machine" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject: 'Subscription Cancelled - Recovery Machine',
      html: htmlContent,
    });

    console.log('Subscription cancellation email sent to:', data.customerEmail);
    return true;

  } catch (error) {
    console.error('Failed to send subscription cancellation email:', error);
    return false;
  }
}