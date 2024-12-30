import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";

const AuthContext = createContext();
const TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Verificar sesión al iniciar la app
  useEffect(() => {
    checkAuthStatus();
    // Intentar recuperar userData del localStorage al iniciar
    const savedUserData = localStorage.getItem(USER_DATA_KEY);
    if (savedUserData) {
      try {
        setUserData(JSON.parse(savedUserData));
      } catch (error) {
        console.error("Error al parsear userData del localStorage:", error);
      }
    }
  }, []);

  // Observar cambios en userData y actualizar localStorage
  useEffect(() => {
    if (userData) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  }, [userData]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      handleLogout();
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        showNotification({
          message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          severity: "warning",
        });
        handleLogout();
        return;
      }

      setIsAuthenticated(true);
      setUserType(decodedToken.rol);
    } catch (error) {
      console.log("Error al verificar sesión: ", error);
      handleLogout();
    }
  };

  const handleLogin = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
      setUserType(decodedToken.rol);

      showNotification({
        message: "Sesión iniciada correctamente",
        severity: "success",
      });
    } catch (error) {
      showNotification({
        message: "Error al iniciar sesión: " + error.message,
        severity: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("cart");
    localStorage.removeItem(USER_DATA_KEY); // Eliminar userData del localStorage
    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null); // Limpiar userData del estado
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    userType,
    userData,
    setUserData,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
