/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Box, CircularProgress, Alert } from "@mui/material";
import { Person as PersonIcon, People as PeopleIcon, ExpandLess, ExpandMore, Add as AddIcon, List as ListIcon } from "@mui/icons-material";
import BienvenidoPage from "./BienvenidoPage";
import ListUsersPage from "./ListUsersPage";
import ListClientsPage from "./ListClientsPage";

const AddUsers = () => <div>Agregar Usuarios</div>;
const AddClient = () => <div>Agregar Cliente</div>;

const OPCIONES = {
  usuarios: {
    Agregar: "/admin/usuarios/agregar",
    Listado: "/admin/usuarios/listado",
  },
  clientes: {
    Agregar: "/admin/clientes/agregar",
    Listado: "/admin/clientes/listado",
  },
};

const ICONS = {
  usuarios: <PersonIcon fontSize="small" />,
  clientes: <PeopleIcon fontSize="small" />,
};

const SUBITEM_ICONS = {
  Agregar: <AddIcon fontSize="small" />,
  Listado: <ListIcon fontSize="small" />,
};

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [activeItem, setActiveItem] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !["Administrador", "Operador"].includes(userType)) {
        setRedirecting(true);
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      const initialOpenState = {};
      Object.keys(OPCIONES).forEach((section) => {
        initialOpenState[section] = false;
      });

      const currentPath = location.pathname;
      Object.entries(OPCIONES).forEach(([section, subItems]) => {
        Object.entries(subItems).forEach(([_, path]) => {
          if (currentPath.includes(path)) {
            initialOpenState[section] = true;
            setActiveItem(path);
          }
        });
      });

      setOpenSections(initialOpenState);
      setLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, userType, location.pathname, navigate]);

  const handleSectionClick = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (redirecting) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" padding={3}>
        <Alert severity="warning">No tiene acceso a esta sección. Será redirigido a la página principal...</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            marginTop: "64px",
            width: "12rem",
          },
        }}
      >
        <List>
          {Object.entries(OPCIONES).map(([section, subItems]) => (
            <React.Fragment key={section}>
              <ListItem
                button
                onClick={() => handleSectionClick(section)}
                sx={{
                  backgroundColor: openSections[section] ? "rgba(0, 0, 0, 0.04)" : "transparent",
                  cursor: "pointer",
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, marginRight: 2 }}>{ICONS[section]}</ListItemIcon>
                <ListItemText primary={section.charAt(0).toUpperCase() + section.slice(1)} />
                {openSections[section] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openSections[section]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Object.entries(subItems).map(([name, path]) => (
                    <ListItem
                      button
                      key={path}
                      onClick={() => handleItemClick(path)}
                      sx={{
                        pl: 4,
                        backgroundColor: activeItem === path ? "rgba(0, 0, 0, 0.08)" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, marginRight: 2 }}>{SUBITEM_ICONS[name]}</ListItemIcon>
                      <ListItemText primary={name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Box sx={{ display: "flex", marginLeft: "7rem", width: "100%" }}>
        <Routes>
          <Route path="/usuarios" element={<Box>Seleccione una opción de usuarios</Box>} />
          <Route
            path="/usuarios/agregar"
            element={
              <Box>
                <AddUsers />
              </Box>
            }
          />
          <Route
            path="/usuarios/listado"
            element={
              <Box>
                <ListUsersPage />
              </Box>
            }
          />
          <Route path="/clientes" element={<Box>Seleccione una opción de clientes</Box>} />
          <Route
            path="/clientes/agregar"
            element={
              <Box>
                <AddClient />
              </Box>
            }
          />
          <Route
            path="/clientes/listado"
            element={
              <Box>
                <ListClientsPage />
              </Box>
            }
          />
          <Route path="/" element={<BienvenidoPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminPage;
