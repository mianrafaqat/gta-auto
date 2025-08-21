import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import { usePathname } from "src/routes/hooks";

import Logo from "src/components/logo";
import SvgColor from "src/components/svg-color";
import Scrollbar from "src/components/scrollbar";

import NavList from "./nav-list";
import LoginButton from "src/layouts/common/login-button";
import { useAuthContext } from "src/auth/hooks";
import { Box, Button } from "@mui/material";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

export default function NavMobile({ data }) {
  const { user = {} } = useAuthContext()?.user || {};
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  return (
    <>
      <IconButton onClick={handleOpenMenu} sx={{ ml: 1 }}>
        <SvgColor
          src="/assets/icons/navbar/ic_menu_item.svg"
          color="white"
          fill="white"
          sx={{ color: "white" }}
        />
      </IconButton>

      <Drawer
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            pb: 5,
            width: 260,
          },
        }}>
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />

          {data.map((list) => (
            <NavList key={list.title} data={list} />
          ))}

          <Box ml="20px" mt="20px">
            {!Object.keys(user).length > 0 && <LoginButton />}
            {Object.keys(user).length > 0 && (
              <MoveTo title="Move to Dashboard" path={paths.dashboard.root} />
            )}
          </Box>
        </Scrollbar>
      </Drawer>
    </>
  );
}

NavMobile.propTypes = {
  data: PropTypes.array,
};

function MoveTo({ sx, title, path }) {
  return (
    <Button
      href={path}
      variant="outlined"
      sx={{ mr: 1, ...sx, whiteSpace: "nowrap" }}>
      {title}
    </Button>
  );
}
