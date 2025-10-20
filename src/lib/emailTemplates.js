// Email templates for order notifications
export const emailTemplates = {
  // Order confirmation email for customer
  orderConfirmation: (order, customer) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Order Confirmation #${order.orderNumber}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #f4f4f4;
        }
        .content {
          padding: 20px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #f4f4f4;
          font-size: 12px;
          color: #666;
        }
        .order-details {
          background: #f8f8f8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .total {
          font-weight: bold;
          font-size: 18px;
          color: #4CAF50;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333; margin: 0;">Garage Tuned Autos</h1>
          <h2 style="color: #4CAF50; margin: 10px 0;">Order Confirmation</h2>
        </div>
        
        <div class="content">
          <h3>Hi ${customer.name || "Customer"},</h3>
          <p>Thank you for your order! We're excited to confirm that your order has been received and is being processed.</p>
          
          <div class="order-details">
            <h4>Order Details</h4>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Shipping Address:</strong></p>
            <p style="margin-left: 20px;">
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.address1}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postcode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          
          <h4>Order Items</h4>
          ${order.items
            .map(
              (item) => `
            <div class="item">
              <div>
                <strong>${item.name}</strong><br>
                <small>Quantity: ${item.quantity}</small>
              </div>
              <div>PKR ${item.priceAtOrder?.toLocaleString() || "0"}</div>
            </div>
          `
            )
            .join("")}
          
          <div class="item total">
            <div>Subtotal:</div>
            <div>PKR ${order.subtotal?.toLocaleString() || "0"}</div>
          </div>
          ${
            order.discountAmount > 0
              ? `
            <div class="item">
              <div>Discount:</div>
              <div>-PKR ${order.discountAmount?.toLocaleString() || "0"}</div>
            </div>
          `
              : ""
          }
          <div class="item">
            <div>Shipping:</div>
            <div>PKR ${order.shippingPrice?.toLocaleString() || "0"}</div>
          </div>
          ${
            order.taxAmount > 0
              ? `
            <div class="item">
              <div>Tax:</div>
              <div>PKR ${order.taxAmount?.toLocaleString() || "0"}</div>
            </div>
          `
              : ""
          }
          <div class="item total">
            <div>Total:</div>
            <div>PKR ${order.finalTotal?.toLocaleString() || "0"}</div>
          </div>
          
          <p>We'll send you another email when your order ships with tracking information.</p>
          
          <a href="https://garagetunedautos.com/dashboard" class="button">View Order</a>
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Garage Tuned Autos. All rights reserved.</p>
          <p>For support, contact us at <a href="mailto:support@garagetunedautos.com">support@garagetunedautos.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Admin notification email
  adminNotification: (order, customer) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Order Alert #${order.orderNumber}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #ff4444;
          background-color: #fff5f5;
        }
        .alert {
          background-color: #ff4444;
          color: white;
          padding: 10px;
          text-align: center;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .order-details {
          background: #f8f8f8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333; margin: 0;">Garage Tuned Autos - Admin Panel</h1>
          <h2 style="color: #ff4444; margin: 10px 0;">New Order Alert</h2>
        </div>
        
        <div class="alert">
          🚨 NEW ORDER RECEIVED - IMMEDIATE ATTENTION REQUIRED
        </div>
        
        <div class="content">
          <h3>Order Details</h3>
          <div class="order-details">
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Total Amount:</strong> PKR ${order.finalTotal?.toLocaleString() || "0"}</p>
          </div>
          
          <h3>Customer Information</h3>
          <div class="order-details">
            <p><strong>Name:</strong> ${customer.name || "N/A"}</p>
            <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
            <p><strong>Address:</strong></p>
            <p style="margin-left: 20px;">
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.address1}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postcode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          
          <h3>Order Items</h3>
          ${order.items
            .map(
              (item) => `
            <div class="item">
              <div>
                <strong>${item.name}</strong><br>
                <small>Quantity: ${item.quantity}</small>
              </div>
              <div>PKR ${item.priceAtOrder?.toLocaleString() || "0"}</div>
            </div>
          `
            )
            .join("")}
          
          <a href="https://garagetunedautos.com/dashboard" class="button">View Order in Dashboard</a>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from Garage Tuned Autos Admin System.</p>
          <p>&copy; ${new Date().getFullYear()} Garage Tuned Autos. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Order status update email
  orderStatusUpdate: (order, newStatus, note) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Order Status Update #${order.orderNumber}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #f4f4f4;
        }
        .status-update {
          background: #e8f5e8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333; margin: 0;">Garage Tuned Autos</h1>
          <h2 style="color: #4CAF50; margin: 10px 0;">Order Status Update</h2>
        </div>
        
        <div class="content">
          <h3>Hi ${order.shippingAddress.firstName || "Customer"},</h3>
          <p>Your order status has been updated!</p>
          
          <div class="status-update">
            <h4>Order #${order.orderNumber}</h4>
            <p><strong>New Status:</strong> ${newStatus}</p>
            ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
          </div>
          
          <p>We'll continue to keep you updated on your order progress.</p>
          
          <a href="https://garagetunedautos.com/dashboard" class="button">View Order</a>
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Garage Tuned Autos. All rights reserved.</p>
          <p>For support, contact us at <a href="mailto:support@garagetunedautos.com">support@garagetunedautos.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Welcome email template
  welcome: (customer) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Welcome to Garage Tuned Autos</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #f4f4f4;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #333; margin: 0;">Garage Tuned Autos</h1>
          <h2 style="color: #4CAF50; margin: 10px 0;">Welcome!</h2>
        </div>
        
        <div class="content">
          <h3>Hi ${customer.name || "Customer"},</h3>
          <p>Welcome to Garage Tuned Autos! We're excited to have you as part of our community.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse our extensive catalog of automotive products</li>
            <li>Track your orders in real-time</li>
            <li>Manage your account and preferences</li>
            <li>Get exclusive deals and offers</li>
          </ul>
          
          <a href="https://gta-auto.vercel.app/dashboard" class="button">Get Started</a>
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Garage Tuned Autos. All rights reserved.</p>
          <p>For support, contact us at <a href="mailto:support@garagetunedautos.com">support@garagetunedautos.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Guard quote request email template
  guardQuote: (quoteData) => {
    const serviceNames = {
      security_guard: "Security Guard",
      security_guard_gun: "Security Guard with Gun",
      two_guard: "Two Guards",
      guard_squad: "Guard Squad"
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Security Guard Quote Request</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #4CAF50;
          background: linear-gradient(135deg, #4CAF50 0%, #66bb6a 100%);
          border-radius: 10px 10px 0 0;
          margin: -20px -20px 20px -20px;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
        }
        .header h2 {
          color: #ffffff;
          margin: 10px 0 0 0;
          font-size: 18px;
          font-weight: normal;
        }
        .content {
          padding: 20px 0;
        }
        .quote-details {
          background: #f8f8f8;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
        }
        .detail-row {
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: bold;
          color: #333;
          display: inline-block;
          min-width: 150px;
        }
        .detail-value {
          color: #666;
        }
        .service-badge {
          display: inline-block;
          background: #4CAF50;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #f4f4f4;
          font-size: 12px;
          color: #666;
          margin-top: 20px;
        }
        .cta-box {
          background: #e8f5e9;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ Garage Tuned Autos</h1>
          <h2>Security Guard Quote Request</h2>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; color: #333;">A new security guard service quote request has been received!</p>
          
          <div class="quote-details">
            <h3 style="margin-top: 0; color: #4CAF50;">Quote Details</h3>
            
            <div class="detail-row">
              <span class="detail-label">Service Type:</span>
              <span class="service-badge">${serviceNames[quoteData.service] || quoteData.service}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${quoteData.name}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value"><a href="mailto:${quoteData.email}">${quoteData.email}</a></span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value"><a href="tel:${quoteData.phone}">${quoteData.phone}</a></span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${quoteData.address}</span>
            </div>

            ${quoteData.durationType ? `
            <div class="detail-row">
              <span class="detail-label">Duration Type:</span>
              <span class="detail-value">${quoteData.durationType}</span>
            </div>
            ` : ''}

            ${quoteData.startDate ? `
            <div class="detail-row">
              <span class="detail-label">Start Date:</span>
              <span class="detail-value">${new Date(quoteData.startDate).toLocaleDateString()}</span>
            </div>
            ` : ''}

            ${quoteData.shiftPreference ? `
            <div class="detail-row">
              <span class="detail-label">Shift Preference:</span>
              <span class="detail-value">${quoteData.shiftPreference}</span>
            </div>
            ` : ''}

            ${quoteData.numberOfGuards ? `
            <div class="detail-row">
              <span class="detail-label">Number of Guards:</span>
              <span class="detail-value">${quoteData.numberOfGuards}</span>
            </div>
            ` : ''}

            ${quoteData.eventType ? `
            <div class="detail-row">
              <span class="detail-label">Event/Location Type:</span>
              <span class="detail-value">${quoteData.eventType}</span>
            </div>
            ` : ''}
            
            <div class="detail-row">
              <span class="detail-label">Message:</span>
              <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 5px;">
                ${quoteData.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="detail-row">
              <span class="detail-label">Request Date:</span>
              <span class="detail-value">${new Date().toLocaleString()}</span>
            </div>
          </div>

          <div class="cta-box">
            <p style="margin: 0; color: #2e7d32; font-weight: bold;">
              ⏰ Please respond to this quote request within 24 hours
            </p>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification from Garage Tuned Autos Security Services</p>
          <p>&copy; ${new Date().getFullYear()} Garage Tuned Autos. All rights reserved.</p>
          <p>Contact: <a href="tel:+923263333456">+92 326 3333456</a> | <a href="mailto:support@garagetunedautos.com">support@garagetunedautos.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  },

  // Guard quote confirmation email for customer
  guardQuoteConfirmation: (quoteData) => {
    const serviceNames = {
      security_guard: "Security Guard",
      security_guard_gun: "Security Guard with Gun",
      two_guard: "Two Guards",
      guard_squad: "Guard Squad"
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Quote Request Received</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #4CAF50;
          background: linear-gradient(135deg, #4CAF50 0%, #66bb6a 100%);
          border-radius: 10px 10px 0 0;
          margin: -20px -20px 20px -20px;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
        }
        .header h2 {
          color: #ffffff;
          margin: 10px 0 0 0;
          font-size: 18px;
          font-weight: normal;
        }
        .content {
          padding: 20px 0;
        }
        .quote-summary {
          background: #f8f8f8;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
        }
        .service-badge {
          display: inline-block;
          background: #4CAF50;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 16px;
          font-weight: bold;
          margin: 10px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #f4f4f4;
          font-size: 12px;
          color: #666;
          margin-top: 20px;
        }
        .highlight-box {
          background: #e8f5e9;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          text-align: center;
        }
        .contact-info {
          background: #fff3cd;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #ffc107;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ Garage Tuned Autos</h1>
          <h2>Quote Request Received</h2>
        </div>
        
        <div class="content">
          <h3 style="color: #333;">Hi ${quoteData.name},</h3>
          <p style="font-size: 16px; color: #666;">Thank you for your interest in our security guard services! We've received your quote request and will get back to you shortly.</p>
          
          <div class="quote-summary">
            <h3 style="margin-top: 0; color: #4CAF50;">Your Request Summary</h3>
            <p><strong>Service Requested:</strong></p>
            <div class="service-badge">${serviceNames[quoteData.service] || quoteData.service}</div>
            <p style="margin-top: 15px;"><strong>Location:</strong> ${quoteData.address}</p>
            ${quoteData.startDate ? `<p><strong>Start Date:</strong> ${new Date(quoteData.startDate).toLocaleDateString()}</p>` : ''}
          </div>

          <div class="highlight-box">
            <p style="margin: 0; color: #2e7d32; font-weight: bold; font-size: 18px;">
              ⏰ We'll respond within 24 hours
            </p>
          </div>

          <div class="contact-info">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #856404;">Need immediate assistance?</p>
            <p style="margin: 0;">📞 Call us: <a href="tel:+923263333456" style="color: #856404;">+92 326 3333456</a></p>
            <p style="margin: 5px 0 0 0;">📧 Email: <a href="mailto:support@garagetunedautos.com" style="color: #856404;">support@garagetunedautos.com</a></p>
          </div>

          <p style="color: #666;">Our team of professional security experts will review your requirements and provide you with a customized quote tailored to your specific needs.</p>
        </div>

        <div class="footer">
          <p>This is an automated confirmation from Garage Tuned Autos</p>
          <p>&copy; ${new Date().getFullYear()} Garage Tuned Autos. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  }
};

export default emailTemplates;
