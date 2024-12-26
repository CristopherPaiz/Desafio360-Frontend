import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App.jsx";
import { theme } from "./utils/theme.js";
import { NotificationProvider } from "./hooks/useNotification.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </ThemeProvider>
);
