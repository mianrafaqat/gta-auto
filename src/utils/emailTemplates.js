// Email templates for order notifications
// These templates can be used by the backend email service

export const EmailTemplates = {
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
          
          <a href="${process.env.APP_URL}/dashboard/orders" class="button">View Order</a>
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
  adminOrderNotification: (order, customer) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Order Received #${order.orderNumber}</title>
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
          background-color: #ff9800;
          color: white;
          border-radius: 5px 5px 0 0;
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
          color: #ff9800;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #ff9800;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .urgent {
          background-color: #ff5722;
          color: white;
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Garage Tuned Autos - Admin</h1>
          <h2 style="margin: 10px 0;">New Order Received</h2>
        </div>
        
        <div class="content">
          <div class="urgent">
            <strong>🚨 NEW ORDER ALERT</strong><br>
            A new order has been placed and requires your attention.
          </div>
          
          <div class="order-details">
            <h4>Order Information</h4>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Total Amount:</strong> PKR ${order.finalTotal?.toLocaleString() || "0"}</p>
          </div>
          
          <div class="order-details">
            <h4>Customer Information</h4>
            <p><strong>Name:</strong> ${customer.name || "N/A"}</p>
            <p><strong>Email:</strong> ${customer.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress.phone || "N/A"}</p>
          </div>
          
          <div class="order-details">
            <h4>Shipping Address</h4>
            <p>
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
                <small>SKU: ${item.sku || "N/A"} | Quantity: ${item.quantity}</small>
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
          
          <a href="${process.env.APP_URL}/dashboard/orders/${order._id}" class="button">View Order in Dashboard</a>
        </div>
        
        <div class="footer">
          <p>This is an automated message for admin notification.</p>
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
        .status-update {
          background: #e3f2fd;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          border-left: 4px solid #2196f3;
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
          
          <a href="${process.env.APP_URL}/dashboard/orders" class="button">View Order</a>
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
};

export default EmailTemplates;
