import { Box, Typography, Button, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link } from "react-router-dom";

const Page404 = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        margin: 0,
        padding: 0,
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: "6rem",
          color: theme.palette.error.main,
        }}
      />
      <Typography variant="h3" component="h1" sx={{ marginTop: 2, fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ marginTop: 1, marginBottom: 3, maxWidth: "500px" }}>
        Oops! Parece que la página que buscas no existe o ha sido movida.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to="/"
        sx={{
          textTransform: "none",
          paddingX: 4,
        }}
      >
        Regresar al inicio
      </Button>
    </Box>
  );
};

export default Page404;
