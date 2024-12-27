import { Typography, Button, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        ¡Oops! Página no encontrada
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        La página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio.
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
    </Container>
  );
};

export default Page404;
