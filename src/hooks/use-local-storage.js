import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useLocalStorage(key, initialState) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const restored = getStorage(key);

    if (restored) {
      setState((prevValue) => ({
        ...prevValue,
        ...restored,
      }));
    }
  }, [key]);

  const updateState = useCallback(
    (updateValue) => {
      setState((prevValue) => {
        setStorage(key, {
          ...prevValue,
          ...updateValue,
        });

        return {
          ...prevValue,
          ...updateValue,
        };
      });
    },
    [key]
  );

  const update = useCallback(
    (name, updateValue) => {
      updateState({
        [name]: updateValue,
      });
    },
    [updateState]
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setState(initialState);
  }, [initialState, key]);

  return {
    state,
    update,
    reset,
  };
}

// ----------------------------------------------------------------------

export const getStorage = (key) => {
  let value = null;

  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const result = window.localStorage.getItem(key);

      if (result) {
        value = JSON.parse(result);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return value;
};

export const setStorage = (key, value) => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = (key) => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(error);
  }
};
