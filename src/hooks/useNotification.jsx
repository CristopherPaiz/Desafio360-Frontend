import { useState, createContext, useContext } from "react";
import { Snackbar, SnackbarContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import PropTypes from "prop-types";

// Contexto para las notificaciones globales
const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // error, success, info, etc.
    color: "blue",
    autoHideDuration: 3000,
    dismissible: true,
  });

  const showNotification = ({ message, severity = "info", color = "blue", autoHideDuration = 3000, dismissible = true }) => {
    setNotification({
      open: true,
      message,
      severity,
      color,
      autoHideDuration,
      dismissible,
    });
  };

  const hideNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={notification.open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={notification.autoHideDuration}
        onClose={hideNotification}
        sx={{
          zIndex: 1500,
        }}
      >
        <SnackbarContent
          message={notification.message}
          sx={{
            backgroundColor: notification.severity === "error" ? "red" : notification.severity === "success" ? "green" : notification.color,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 16px",
          }}
          action={
            notification.dismissible && (
              <IconButton size="small" color="inherit" onClick={hideNotification}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )
          }
        />
      </Snackbar>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
