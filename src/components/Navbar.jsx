import { AppBar, Toolbar, Button, IconButton, Badge, Box, InputBase, Paper, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { ShoppingCart, Home, Receipt, Settings, Logout, Search, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import useIsSmallScreen from "../hooks/useIsSmallScreen";

const Navbar = ({ cartItemsCount = 0, handleLogout, userType }) => {
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const menuConfig = {
    Cliente: [
      { icon: <Home />, text: "Inicio", path: "/" },
      { icon: <Receipt />, text: "Órdenes", path: "/mis-ordenes" },
      { icon: <ShoppingCart />, text: "Carrito", path: "/carrito" },
      { icon: <Logout />, text: "Cerrar Sesión", onClick: handleLogout },
    ],
    Administrador: [
      { icon: <Home />, text: "Inicio", path: "/" },
      { icon: <Receipt />, text: "Órdenes", path: "/ordenes" },
      { icon: <Settings />, text: "Administración", path: "/admin" },
      { icon: <Logout />, text: "Cerrar Sesión", onClick: handleLogout },
    ],
    Operador: [
      { icon: <Home />, text: "Inicio", path: "/" },
      { icon: <Receipt />, text: "Órdenes", path: "/ordenes" },
      { icon: <Settings />, text: "Administración", path: "/admin" },
      { icon: <Logout />, text: "Cerrar Sesión", onClick: handleLogout },
    ],
  };

  const menuItems = menuConfig[userType] || [];

  const renderMenuItems = (items) =>
    items.map((item, index) => (
      <MenuItem key={index} onClick={() => (item.onClick ? item.onClick() : handleNavigation(item.path))}>
        <ListItemIcon>
          {item.text === "Carrito" ? (
            <Badge badgeContent={cartItemsCount} color="error">
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText>{item.text}</ListItemText>
      </MenuItem>
    ));

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box
          sx={{
            flexGrow: 0,
            mr: 2,
            cursor: "pointer",
            "&:hover": { opacity: 0.8 },
          }}
          onClick={() => navigate("/")}
        >
          <Box component="img" src="/LogoMedium.webp" alt="Logo" sx={{ height: isSmallScreen ? "30px" : "40px", display: "block" }} />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            mx: isSmallScreen ? 1 : 2,
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: isSmallScreen ? "100%" : "50%",
              bgcolor: "background.paper",
            }}
          >
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder={isSmallScreen ? "Buscar..." : "Buscar productos..."} />
            <IconButton type="submit" sx={{ p: "10px" }}>
              <Search />
            </IconButton>
          </Paper>
        </Box>

        {isSmallScreen ? (
          <>
            <IconButton color="inherit" onClick={handleMenuClick} edge="end">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {renderMenuItems(menuItems)}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {menuItems.map((item, index) =>
              item.text === "Carrito" ? (
                <IconButton key={index} color="inherit" onClick={() => navigate(item.path)}>
                  <Badge badgeContent={cartItemsCount} color="error">
                    {item.icon}
                  </Badge>
                </IconButton>
              ) : (
                <Button key={index} color="inherit" startIcon={item.icon} onClick={() => (item.onClick ? item.onClick() : navigate(item.path))}>
                  {item.text}
                </Button>
              )
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  cartItemsCount: PropTypes.number,
  handleLogout: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
};

export default Navbar;
