"use client";

import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useMemo } from "react";

import { paths } from "src/routes/paths";
import { useRouter, usePathname } from "src/routes/hooks";

import { SplashScreen } from "src/components/loading-screen";

import { useAuthContext } from "../hooks";

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.login,
  auth0: paths.auth.auth0.login,
  amplify: paths.auth.amplify.login,
  firebase: paths.auth.firebase.login,
  supabase: paths.auth.supabase.login,
};

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container> {children}</Container>}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

function Container({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { authenticated, method, user } = useAuthContext();
  const isAuthenticated = useMemo(() => {
    const userAccount = user?.user;
    if (userAccount?._id) {
      return true;
    } else {
      return false;
    }
  }, [user]);

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
      const loginPath = loginPaths[method];
      const href = `${loginPath}?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router, isAuthenticated, pathname]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

Container.propTypes = {
  children: PropTypes.node,
};
