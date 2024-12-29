import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import MainLayout from "./MainLayout";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

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

  // Si está autenticado, mostramos el contenido
  return <MainLayout>{children}</MainLayout>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
