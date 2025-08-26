/**
 * Transform API order data to match the expected component structure
 */

export function transformApiOrderToComponent(apiOrder) {
  if (!apiOrder) return null;

  // Handle different API response structures
  // Admin API returns orders directly, user API returns { orders: [...] }
  const orderData = apiOrder.orders ? apiOrder.orders : apiOrder;

  if (Array.isArray(orderData)) {
    // If it's an array, transform each order
    return orderData.map(transformSingleOrder).filter(Boolean);
  }

  // If it's a single order object
  return transformSingleOrder(orderData);
}

/**
 * Transform a single order object
 */
function transformSingleOrder(order) {
  if (!order) return null;

  // Check if the order is already in the correct format
  if (order.items && order.items[0] && order.items[0].price !== undefined) {
    // The order is already in the correct format, just return it
    return order;
  }

  // Calculate totals
  const totalQuantity =
    order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const subTotal = order.subtotal || 0;
  const shipping = order.shippingPrice || 0;
  const discount = order.discountAmount || 0;
  const taxes = order.taxAmount || 0;
  const totalAmount = order.finalTotal || 0;

  // Transform customer data
  const customer = {
    id: order.customer,
    firstName:
      order.shippingAddress?.firstName ||
      order.billingAddress?.firstName ||
      "Unknown",
    lastName:
      order.shippingAddress?.lastName || order.billingAddress?.lastName || "",
    name: `${order.shippingAddress?.firstName || order.billingAddress?.firstName || "Unknown"} ${order.shippingAddress?.lastName || order.billingAddress?.lastName || ""}`.trim(),
    email:
      order.shippingAddress?.email || order.billingAddress?.email || "No email",
    avatarUrl: null, // API doesn't provide avatar
    ipAddress: "Unknown",
  };

  // Transform delivery data
  const delivery = {
    shipBy: order.shippingMethod?.name || "Standard Shipping",
    speedy: order.shippingMethod?.estimatedDelivery
      ? `${order.shippingMethod.estimatedDelivery.min}-${order.shippingMethod.estimatedDelivery.max} days`
      : "Standard",
    trackingNumber: order.trackingLogs?.[0]?.trackingNumber || "Not available",
  };

  // Transform items
  const items =
    order.items?.map((item, index) => ({
      id: item._id || `item-${index}`,
      sku: item.product?.sku || item.sku || "No SKU",
      quantity: item.quantity || 0,
      name: item.product?.name || item.name || "Unknown Product",
      coverUrl: item.product?.coverUrl || item.coverUrl || null,
      price: item.price || item.priceAtOrder || 0,
      product: item.product || null,
    })) || [];

  // Create history timeline
  const history = {
    orderTime: order.createdAt,
    paymentTime: order.paymentStatus === "paid" ? order.updatedAt : null,
    deliveryTime: null, // Not provided by API
    completionTime: order.status === "completed" ? order.updatedAt : null,
    timeline: [
      {
        title: "Order has been created",
        time: order.createdAt,
      },
      ...(order.paymentStatus === "paid"
        ? [
            {
              title: "Payment received",
              time: order.updatedAt,
            },
          ]
        : []),
      ...(order.status === "completed"
        ? [
            {
              title: "Order completed",
              time: order.updatedAt,
            },
          ]
        : []),
    ],
  };

  // Transform payment data
  const payment = {
    cardType: order.paymentMethod === "card" ? "credit" : "cash",
    cardNumber:
      order.paymentMethod === "card"
        ? "**** **** **** ****"
        : order.paymentMethod === "cash"
          ? "Cash on Delivery"
          : order.paymentMethod || "Unknown",
  };

  const transformedOrder = {
    id: order._id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    taxes,
    items,
    history,
    subTotal,
    shipping,
    discount,
    customer,
    delivery,
    totalAmount,
    finalTotal: order.finalTotal || totalAmount,
    totalQuantity,
    shippingAddress: {
      fullAddress: [
        order.shippingAddress?.address1,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.shippingAddress?.postcode,
        order.shippingAddress?.country,
      ]
        .filter(Boolean)
        .join(", "),
      phoneNumber: order.shippingAddress?.phone || "No phone",
    },
    billingAddress: {
      fullAddress: [
        order.billingAddress?.address1,
        order.billingAddress?.city,
        order.billingAddress?.state,
        order.billingAddress?.postcode,
        order.billingAddress?.country,
      ]
        .filter(Boolean)
        .join(", "),
      phoneNumber: order.billingAddress?.phone || "No phone",
    },
    payment,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    shippingMethod: order.shippingMethod,
  };

  return transformedOrder;
}

/**
 * Transform multiple orders
 */
export function transformApiOrdersToComponent(apiOrders) {
  if (!apiOrders) return [];

  // Handle different response structures
  if (Array.isArray(apiOrders)) {
    return apiOrders.map(transformSingleOrder).filter(Boolean);
  }

  if (apiOrders.orders && Array.isArray(apiOrders.orders)) {
    return apiOrders.orders.map(transformSingleOrder).filter(Boolean);
  }

  // If it's a single order, wrap it in an array
  const singleOrder = transformSingleOrder(apiOrders);
  return singleOrder ? [singleOrder] : [];
}
