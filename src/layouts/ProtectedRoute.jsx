import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import MainLayout from "./MainLayout";
import { Box, CircularProgress } from "@mui/material";

// Definimos qué rutas puede acceder cada tipo de usuario
const routePermissions = {
  "/ordenes": ["Administrador", "Operador"],
  "/admin": ["Administrador"],
  "/": ["Administrador", "Operador", "Cliente"],
  "/productos": ["Administrador", "Operador", "Cliente"],
  "/carrito": ["Cliente"],
  "/categorias": ["Administrador", "Operador", "Cliente"],
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userType } = useAuth();

  // Verificamos si hay un token en localStorage
  const token = localStorage.getItem("authToken");

  // Si no hay token, redirigimos al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token pero no está autenticado todavía, mostramos loading
  if (token && !isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Obtenemos la ruta actual
  const currentPath = window.location.pathname;

  // Encontramos la ruta base para verificar permisos
  const basePath = Object.keys(routePermissions).find((path) => currentPath === path || currentPath.startsWith(`${path}/`));

  // Si la ruta existe en nuestras definiciones, verificamos los permisos
  if (basePath) {
    const allowedRoles = routePermissions[basePath];
    if (!allowedRoles.includes(userType)) {
      // Si el usuario no tiene permiso, lo redirigimos a la página principal
      return <Navigate to="/" replace />;
    }
  }

  // Si está autenticado y tiene los permisos correctos, mostramos el contenido
  return <MainLayout>{children}</MainLayout>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
