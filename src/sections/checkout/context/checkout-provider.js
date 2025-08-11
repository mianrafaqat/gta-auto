"use client";

import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { CheckoutContext } from "./checkout-context";

// ----------------------------------------------------------------------

const STORAGE_KEY = "checkout";

const initialState = {
  activeStep: 0,
  items: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  shippingMethod: null,
};

export function CheckoutProvider({ children }) {
  const [checkout, setCheckout] = useState(() => {
    const restored =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")
        : null;
    return restored || initialState;
  });

  useEffect(() => {
    if (checkout !== initialState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkout));
    }
  }, [checkout]);

  const onReset = useCallback(() => {
    setCheckout(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const onNextStep = useCallback(() => {
    setCheckout((prevState) => ({
      ...prevState,
      activeStep: prevState.activeStep + 1,
    }));
  }, []);

  const onBackStep = useCallback(() => {
    setCheckout((prevState) => ({
      ...prevState,
      activeStep: prevState.activeStep - 1,
    }));
  }, []);

  const onGotoStep = useCallback((step) => {
    setCheckout((prevState) => ({
      ...prevState,
      activeStep: step,
    }));
  }, []);

  const onApplyShipping = useCallback((shippingMethod) => {
    setCheckout((prevState) => ({
      ...prevState,
      shipping: shippingMethod.price || 0,
      total:
        prevState.subTotal -
        (prevState.discount || 0) +
        (shippingMethod.price || 0),
      shippingMethod: {
        id: shippingMethod.id,
        name: shippingMethod.name,
        price: shippingMethod.price,
        estimatedDelivery: shippingMethod.estimatedDelivery,
      },
    }));
  }, []);

  const onApplyDiscount = useCallback((discount) => {
    setCheckout((prevState) => ({
      ...prevState,
      discount,
      total: prevState.subTotal - discount + (prevState.shipping || 0),
    }));
  }, []);

  const onCreateBilling = useCallback((billing) => {
    setCheckout((prevState) => ({
      ...prevState,
      billing,
    }));
  }, []);

  const onAddCart = useCallback((product) => {
    setCheckout((prevState) => {
      const newItems = [...prevState.items];
      const existingProductIndex = newItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        newItems[existingProductIndex].quantity += 1;
      } else {
        newItems.push({
          id: product.id,
          name: product.name,
          coverUrl: product.coverUrl,
          price: product.price,
          quantity: 1,
        });
      }

      const subTotal = newItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return {
        ...prevState,
        items: newItems,
        subTotal,
        total: subTotal - (prevState.discount || 0) + (prevState.shipping || 0),
      };
    });
  }, []);

  const onDeleteCart = useCallback((productId) => {
    setCheckout((prevState) => {
      const newItems = prevState.items.filter((item) => item.id !== productId);
      const subTotal = newItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return {
        ...prevState,
        items: newItems,
        subTotal,
        total: subTotal - (prevState.discount || 0) + (prevState.shipping || 0),
      };
    });
  }, []);

  const onIncreaseQuantity = useCallback((productId) => {
    setCheckout((prevState) => {
      const newItems = prevState.items.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      const subTotal = newItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return {
        ...prevState,
        items: newItems,
        subTotal,
        total: subTotal - (prevState.discount || 0) + (prevState.shipping || 0),
      };
    });
  }, []);

  const onDecreaseQuantity = useCallback((productId) => {
    setCheckout((prevState) => {
      const newItems = prevState.items
        .map((item) => {
          if (item.id === productId) {
            return {
              ...item,
              quantity: Math.max(0, item.quantity - 1),
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      const subTotal = newItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return {
        ...prevState,
        items: newItems,
        subTotal,
        total: subTotal - (prevState.discount || 0) + (prevState.shipping || 0),
      };
    });
  }, []);

  const onBuyNow = useCallback((product) => {
    setCheckout((prevState) => {
      const newItem = {
        id: product.id,
        name: product.name,
        coverUrl: product.coverUrl,
        price: product.price,
        quantity: 1,
      };

      return {
        ...prevState,
        items: [newItem],
        subTotal: newItem.price,
        total:
          newItem.price - (prevState.discount || 0) + (prevState.shipping || 0),
      };
    });
  }, []);

  const value = {
    checkout,
    onReset,
    onNextStep,
    onBackStep,
    onGotoStep,
    onBuyNow,
    onAddCart,
    onDeleteCart,
    onIncreaseQuantity,
    onDecreaseQuantity,
    onCreateBilling,
    onApplyShipping,
    onApplyDiscount,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

CheckoutProvider.propTypes = {
  children: PropTypes.node,
};
