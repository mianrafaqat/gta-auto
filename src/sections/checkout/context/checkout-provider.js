<<<<<<< Updated upstream
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
=======
'use client';

import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { CheckoutContext } from './checkout-context';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'checkout';

const initialState = {
  activeStep: 0,
  items: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
};

export function CheckoutProvider({ children }) {
  const router = useRouter();

  const { state, update, reset } = useLocalStorage(STORAGE_KEY, initialState);

  const validateAndFixCheckoutState = useCallback(() => {
    // Ensure activeStep is within valid range
    if (state.activeStep < 0 || state.activeStep >= PRODUCT_CHECKOUT_STEPS.length) {
      update('activeStep', 0);
    }
    
    // If we're on step 2 or higher but have no billing address, go back to step 1
    if (state.activeStep >= 2 && !state.billing) {
      update('activeStep', 1);
    }
    
    // If we have items but no activeStep, start from step 0
    if (state.items.length > 0 && state.activeStep === 0) {
      update('activeStep', 1);
    }
  }, [state.activeStep, state.billing, state.items.length, update]);

  const onGetCart = useCallback(() => {
    const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

    const subTotal = state.items.reduce((total, item) => total + item.quantity * item.price, 0);

    update('subTotal', subTotal);
    update('totalItems', totalItems);
    // Don't clear billing address on refresh - only clear it when explicitly going back to step 1
    // update('billing', state.activeStep === 1 ? null : state.billing);
    update('discount', state.items.length ? state.discount : 0);
    update('shipping', state.items.length ? state.shipping : 0);
    update('total', state.subTotal - state.discount + state.shipping);
    
    // Validate and fix the checkout state after calculations
    validateAndFixCheckoutState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.items,
    state.activeStep,
    state.billing,
    state.discount,
    state.shipping,
    state.subTotal,
    validateAndFixCheckoutState,
  ]);

  useEffect(() => {
    const restored = getStorage(STORAGE_KEY);

    if (restored) {
      console.log('Checkout state restored from storage:', restored);
      onGetCart();
    }
  }, [onGetCart]);

  // Debug function to log current checkout state
  const onDebugState = useCallback(() => {
    console.log('Current checkout state:', state);
    console.log('Storage key:', STORAGE_KEY);
    console.log('Storage value:', getStorage(STORAGE_KEY));
  }, [state]);

  const onAddToCart = useCallback(
    (newItem) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === newItem.id) {
          return {
            ...item,
            colors: uniq([...item.colors, ...newItem.colors]),
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      if (!updatedItems.some((item) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onDeleteCart = useCallback(
    (itemId) => {
      const updatedItems = state.items.filter((item) => item.id !== itemId);

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onBackStep = useCallback(() => {
    const newStep = state.activeStep - 1;
    update('activeStep', newStep);
    
    // Clear billing address when going back to step 1 (address selection)
    if (newStep === 1) {
      update('billing', null);
    }
  }, [update, state.activeStep]);

  const onNextStep = useCallback(() => {
    update('activeStep', state.activeStep + 1);
  }, [update, state.activeStep]);

  const onGotoStep = useCallback(
    (step) => {
      update('activeStep', step);
      
      // Clear billing address when going back to step 1 (address selection)
      if (step === 1) {
        update('billing', null);
      }
    },
    [update]
  );

  const onIncreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onDecreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onCreateBilling = useCallback(
    (address) => {
      // Ensure the address has all required fields
      const billingAddress = {
        ...address,
        // Ensure we have a proper ID field
        id: address._id || address.id,
      };
      
      update('billing', billingAddress);
      onNextStep();
    },
    [onNextStep, update]
  );

  const onApplyDiscount = useCallback(
    (discount) => {
      update('discount', discount);
    },
    [update]
  );

  const onApplyShipping = useCallback(
    (shipping) => {
      update('shipping', shipping);
    },
    [update]
  );

  // Manual restore function for debugging and manual state recovery
  const onRestoreState = useCallback(() => {
    const restored = getStorage(STORAGE_KEY);
    if (restored) {
      // Restore the state and then validate it
      Object.keys(restored).forEach(key => {
        if (restored[key] !== undefined) {
          update(key, restored[key]);
        }
      });
      // Validate and fix the state after restoration
      setTimeout(() => validateAndFixCheckoutState(), 0);
    }
  }, [update, validateAndFixCheckoutState]);

  // Clear checkout state completely
  const onClearState = useCallback(() => {
    reset();
    console.log('Checkout state cleared');
  }, [reset]);

  const completed = state.activeStep === PRODUCT_CHECKOUT_STEPS.length;

  // Reset
  const onReset = useCallback(() => {
    if (completed) {
      reset();
      router.replace(paths.product.root);
    }
  }, [completed, reset, router]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      completed,
      //
      onAddToCart,
      onDeleteCart,
      //
      onIncreaseQuantity,
      onDecreaseQuantity,
      //
      onCreateBilling,
      onApplyDiscount,
      onApplyShipping,
      //
      onBackStep,
      onNextStep,
      onGotoStep,
      //
      onReset,
      onRestoreState,
      onClearState,
      onDebugState,
    }),
    [
      completed,
      onAddToCart,
      onApplyDiscount,
      onApplyShipping,
      onBackStep,
      onCreateBilling,
      onDecreaseQuantity,
      onDeleteCart,
      onGotoStep,
      onIncreaseQuantity,
      onNextStep,
      onReset,
      onRestoreState,
      onClearState,
      onDebugState,
      state,
    ]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}

CheckoutProvider.propTypes = {
  children: PropTypes.node,
};
>>>>>>> Stashed changes
