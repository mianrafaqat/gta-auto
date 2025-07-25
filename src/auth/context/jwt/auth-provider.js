"use client";

import PropTypes from "prop-types";
import { useMemo, useEffect, useReducer, useCallback } from "react";

import axios, { endpoints } from "src/utils/axios";
import { ACCESS_TOKEN_KEY, STORAGE_USER_KEY } from "src/utils/constants";
import cityAutosInstance from "src/utils/requestInterceptor";

import {
  setSession,
  storeAccessTokenSessionStorage,
  storeUserDetailsSessionStorage,
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
      const user = localStorage.getItem(STORAGE_USER_KEY);

      if (accessToken && user) {
        dispatch({
          type: "INITIAL",
          payload: {
            user: {
              user: JSON.parse(user),
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: "INITIAL",
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
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
    const response = await cityAutosInstance.post(
      role === "user" ? endpoints.auth.login.user : endpoints.auth.login.admin,
      DATA
    );

    let { data = {}, status = 0 } = response || {};

    if (status === 200) {
      data = { ...data, role };
      storeAccessTokenSessionStorage(data?._id);
      storeUserDetailsSessionStorage(data);

      dispatch({
        type: "LOGIN",
        payload: {
          user: {
            user: data || {},
            accessToken: data?._id,
          },
        },
      });
    } else {
      throw new Error(response);
    }
  }, []);

  // UPDATE USER
  const updateUserData = useCallback(async (data) => {
    storeAccessTokenSessionStorage(data?._id);
    storeUserDetailsSessionStorage(data);

    dispatch({
      type: "UPDATE_USER",
      payload: {
        user: {
          user: data || {},
          accessToken: data?._id,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (data) => {
    const response = await cityAutosInstance.post(
      endpoints.auth.register,
      data
    );
    return response;

    // dispatch({
    //   type: 'REGISTER',
    //   payload: {
    //     user: {
    //       ...user,
    //       accessToken,
    //     },
    //   },
    // });
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
