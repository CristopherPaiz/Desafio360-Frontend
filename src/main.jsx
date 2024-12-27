import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./utils/theme.js";
import { NotificationProvider } from "./hooks/useNotification.jsx";
import App from "./App.jsx";
import "./styles/styles.css"; // Estilos globales

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </ThemeProvider>
);
