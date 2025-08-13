"use client";

import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { CheckoutContext } from "./checkout-context";

// ----------------------------------------------------------------------

const STORAGE_KEY = "checkout";

const initialState = {
  activeStep: 0, // Start at cart step to show items first
  items: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  shippingMethod: null,
  lastOrder: null,
};

export function CheckoutProvider({ children }) {
  const [checkout, setCheckout] = useState(() => {
    const restored =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")
        : null;

    console.log("CheckoutProvider initial state:", {
      restored,
      initialState,
      finalState: restored || initialState,
    });

    return restored || initialState;
  });

  useEffect(() => {
    console.log("CheckoutProvider useEffect - saving to localStorage:", {
      checkout,
      isInitialState: checkout === initialState,
      itemsCount: checkout?.items?.length,
    });

    if (checkout !== initialState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkout));
      console.log("CheckoutProvider: State saved to localStorage");
    }
  }, [checkout]);

  const onReset = useCallback(() => {
    console.log("onReset called - clearing checkout state");
    setCheckout(initialState);
    localStorage.removeItem(STORAGE_KEY);
    console.log("onReset completed - localStorage cleared");
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

  const onOrderSuccess = useCallback((orderData) => {
    setCheckout((prevState) => ({
      ...prevState,
      lastOrder: orderData,
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
    console.log("onBuyNow called with product:", product);

    // Clear localStorage first to prevent interference
    localStorage.removeItem(STORAGE_KEY);
    console.log("onBuyNow: localStorage cleared");

    setCheckout((prevState) => {
      console.log("onBuyNow prevState:", prevState);

      const newItem = {
        id: product.id,
        name: product.name,
        coverUrl: product.coverUrl,
        price: product.price,
        quantity: 1,
      };

      const newState = {
        ...prevState,
        items: [newItem],
        subTotal: newItem.price,
        total:
          newItem.price - (prevState.discount || 0) + (prevState.shipping || 0),
        activeStep: 0, // Ensure we start at cart step
      };

      console.log("onBuyNow new state:", newState);
      console.log("onBuyNow new items array:", newState.items);

      // Immediately save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      console.log("onBuyNow: new state saved to localStorage");

      return newState;
    });
  }, []);

  const onClearCart = useCallback(() => {
    setCheckout((prevState) => ({
      ...prevState,
      items: [],
      subTotal: 0,
      total: 0,
    }));
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
    onOrderSuccess,
    onApplyShipping,
    onApplyDiscount,
    onClearCart,
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
