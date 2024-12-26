import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ffa045",
      dark: "#e88f3d",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e8dcd2",
      dark: "#d6c5b8",
    },
    accent: {
      main: "#00a878",
      dark: "#00996d",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f4f4",
      dark: "#1a1a1a",
    },
    text: {
      primary: "#1c1c1c",
      secondary: "#737373",
      onPrimary: "#ffffff",
      onSecondary: "#ffffff",
    },
  },
});
