"use client";

import PropTypes from "prop-types";
import { useMemo, useEffect, useReducer, useCallback } from "react";

import axios, { endpoints } from "src/utils/axios";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, STORAGE_USER_KEY } from "src/utils/constants";
import gtaAutosInstance from "src/utils/requestInterceptor";

import {
  setSession,
  storeTokens,
  storeUserDetailsSessionStorage,
  emptySessionStorage,
} from "./utils";

import { AuthContext } from "./auth-context";

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === "INITIAL") {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === "LOGIN" || action.type === "UPDATE_USER") {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === "REGISTER") {
    return {
      ...state,
      user: null,
    };
  }
  if (action.type === "LOGOUT") {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const userStr = localStorage.getItem(STORAGE_USER_KEY);

      if (!accessToken || !refreshToken || !userStr) {
        throw new Error('Missing authentication data');
      }

      const userData = JSON.parse(userStr);
      
      // Validate user data and role
      if (!userData || !userData.role || !['user', 'admin', 'superadmin'].includes(userData.role)) {
        throw new Error('Invalid user data');
      }

      dispatch({
        type: "INITIAL",
        payload: {
          user: {
            user: userData,
            accessToken,
          },
        },
      });
    } catch (error) {
      console.error('Initialization error:', error);
      // Clear invalid data
      emptySessionStorage();
      dispatch({
        type: "INITIAL",
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (DATA) => {
    const { role = "" } = DATA || {};
    const response = await gtaAutosInstance.post(
       endpoints.auth.login.user,
      DATA
    );

    let { data = {}, status = 0 } = response || {};

    if (status === 200) {
      if (!data) {
        throw new Error('Response data not found');
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.user || !data.accessToken || !data.refreshToken) {
        throw new Error('Invalid response format');
      }

      // User data already contains role from server
      const userData = data.user;
      const { accessToken, refreshToken } = data;
      
      // Validate user role
      if (!['user', 'admin', 'superadmin'].includes(userData.role)) {
        throw new Error('Invalid user role');
      }
      
      storeTokens(accessToken, refreshToken);
      storeUserDetailsSessionStorage(userData);

      dispatch({
        type: "LOGIN",
        payload: {
          user: {
            user: userData,
            accessToken,
          },
        },
      });
    } else {
      throw new Error(response);
    }
  }, []);

  // UPDATE USER
  const updateUserData = useCallback(async (data) => {
    const userData = data.user || data;
    const accessToken = data.accessToken || localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = data.refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY);
    
    storeUserDetailsSessionStorage(userData);
    if (data.accessToken && data.refreshToken) {
      storeTokens(accessToken, refreshToken);
    }

    dispatch({
      type: "UPDATE_USER",
      payload: {
        user: {
          user: userData,
          accessToken,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (data) => {
    const response = await gtaAutosInstance.post(
      endpoints.auth.register,
      data
    );
    console.log(response);
    // API returns { message: "User registered. Need Verification" }
    if (response?.status === 200) {
      // Clear any existing auth data
      emptySessionStorage();
      
      dispatch({
        type: "REGISTER",
        payload: null
      });

      return {
        status: 200,
        data: {
          message: response?.data?.message || "User registered. Need Verification",
          userId: response?.data?.userId // Pass the userId from the response
        }
      };
    } else {
      throw new Error(response?.data?.message || 'Registration failed');
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: "LOGOUT",
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      //
      login,
      register,
      logout,
      updateUserData,
    }),
    [login, logout, register, state.user, status, updateUserData]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
