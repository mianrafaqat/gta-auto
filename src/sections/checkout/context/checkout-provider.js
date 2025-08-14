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
  activeStep: 0, // Start at cart step to show items first
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