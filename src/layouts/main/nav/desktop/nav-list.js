import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";

import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Portal from "@mui/material/Portal";
import { useTheme } from "@mui/material/styles";
import ListSubheader from "@mui/material/ListSubheader";

import { usePathname } from "src/routes/hooks";
import { useActiveLink } from "src/routes/hooks/use-active-link";

import { paper } from "src/theme/css";

import { HEADER } from "../../../config-layout";
import { NavItem, NavItemDashboard } from "./nav-item";

// ----------------------------------------------------------------------

export default function NavList({ data }) {
  const theme = useTheme();

  const pathname = usePathname();

  const active = useActiveLink(data.path, !!data.children);

  const [openMenu, setOpenMenu] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      // Clear any existing close timeout
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        setCloseTimeout(null);
      }
      setOpenMenu(true);
    }
  }, [data.children, closeTimeout]);

  const handleCloseMenu = useCallback(() => {
    // Add a small delay to prevent immediate closing when moving mouse
    const timeout = setTimeout(() => {
      setOpenMenu(false);
    }, 150); // 150ms delay
    setCloseTimeout(timeout);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (data.children) {
      // Clear any existing close timeout
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        setCloseTimeout(null);
      }
      setOpenMenu(true);
    }
  }, [data.children, closeTimeout]);

  const handleMouseLeave = useCallback(() => {
    handleCloseMenu();
  }, [handleCloseMenu]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <>
      <NavItem
        open={openMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        //
        title={data.title}
        path={data.path}
        //
        hasChild={!!data.children}
        externalLink={data.path.includes("http")}
        //
        active={active}
      />

      {!!data.children && openMenu && (
        <Portal>
          <Fade in={openMenu}>
            <Paper
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{
                ...paper({ theme }),
                left: 0,
                right: 0,
                m: "auto",
                display: "flex",
                borderRadius: 2,
                position: "fixed",
                zIndex: theme.zIndex.modal,
                p: theme.spacing(5, 1, 1, 3),
                top: HEADER.H_DESKTOP_OFFSET,
                maxWidth: theme.breakpoints.values.lg,
                boxShadow: theme.customShadows.dropdown,
                // Add a small margin-top to create a hover bridge
                mt: -0.5,
              }}>
              {data.children.map((list) => (
                <NavSubList
                  key={list.subheader}
                  subheader={list.subheader}
                  data={list.items}
                />
              ))}
            </Paper>
          </Fade>
        </Portal>
      )}
    </>
  );
}

NavList.propTypes = {
  data: PropTypes.shape({
    path: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.array,
  }),
};

// ----------------------------------------------------------------------

function NavSubList({ data, subheader, sx, ...other }) {
  const pathname = usePathname();

  const dashboard = subheader === "Dashboard";

  return (
    <Stack
      spacing={2}
      flexGrow={1}
      alignItems="flex-start"
      sx={{
        pb: 2,
        ...(dashboard && {
          pb: 0,
          maxWidth: { md: 1 / 3, lg: 540 },
        }),
        ...sx,
      }}
      {...other}>
      <ListSubheader
        disableSticky
        sx={{
          p: 0,
          typography: "overline",
          fontSize: 11,
          color: "text.primary",
        }}>
        {subheader}
      </ListSubheader>

      {data.map((item) =>
        dashboard ? (
          <NavItemDashboard key={item.title} path={item.path} />
        ) : (
          <NavItem
            key={item.title}
            title={item.title}
            path={item.path}
            active={pathname === item.path || pathname === `${item.path}/`}
            subItem
          />
        )
      )}
    </Stack>
  );
}

NavSubList.propTypes = {
  data: PropTypes.array,
  subheader: PropTypes.string,
  sx: PropTypes.object,
};
