import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { Snackbar, SnackbarContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import PropTypes from "prop-types";

// Contexto para las notificaciones globales
const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // Cola de notificaciones
  const [activeNotification, setActiveNotification] = useState(null); // Notificación actual

  const showNotification = ({ message, severity = "info", color = "blue", autoHideDuration = 3000, dismissible = true }) => {
    setQueue((prevQueue) => [...prevQueue, { message, severity, color, autoHideDuration, dismissible }]);
  };

  const hideNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  useEffect(() => {
    if (!activeNotification && queue.length > 0) {
      // Extrae la primera notificación de la cola y la muestra
      setActiveNotification(queue[0]);
      setQueue((prevQueue) => prevQueue.slice(1)); // Elimina la notificación actual de la cola
    }
  }, [queue, activeNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {activeNotification && (
        <Snackbar
          open={!!activeNotification}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={activeNotification.autoHideDuration}
          onClose={hideNotification}
          TransitionProps={{
            onExited: hideNotification, // Aquí se asigna correctamente
          }}
          sx={{
            zIndex: 1500,
          }}
        >
          <SnackbarContent
            message={activeNotification.message}
            sx={{
              backgroundColor:
                activeNotification.severity === "error" ? "red" : activeNotification.severity === "success" ? "green" : activeNotification.color,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 16px",
            }}
            action={
              activeNotification.dismissible && (
                <IconButton size="small" color="inherit" onClick={hideNotification}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )
            }
          />
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
