import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PropTypes from "prop-types";

const CardProducto = ({ producto }) => {
  const { idProductos, nombre, marca, precio, foto, stock } = producto;

  const isAgotado = stock === 0;
  const isCasiAgotado = stock < 50;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      {(isAgotado || isCasiAgotado) && (
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
          <Chip label={isAgotado ? "Agotado" : "Casi agotado"} color={isAgotado ? "error" : "warning"} size="small" />
        </Box>
      )}

      {/* Enlace o contenedor desactivado si está agotado */}
      <Box
        component={isAgotado ? "div" : Link}
        to={isAgotado ? undefined : `/productos/${idProductos}`}
        sx={{
          textDecoration: "none",
          color: "inherit",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          pointerEvents: isAgotado ? "none" : "auto",
        }}
      >
        <CardMedia
          component="img"
          height="120"
          image={foto}
          alt={nombre}
          sx={{
            objectFit: "contain",
            filter: isAgotado ? "grayscale(100%)" : "none",
          }}
        />
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {marca}
          </Typography>
          <Typography variant="h6" component="h3">
            {nombre}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: "auto" }}>
            Q{precio.toFixed(2)}
          </Typography>
        </CardContent>
      </Box>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          disabled={isAgotado}
          onClick={(e) => {
            if (isAgotado) {
              e.preventDefault();
            }
          }}
          size="small"
          fullWidth
        >
          Añadir al carrito
        </Button>
      </Box>
    </Card>
  );
};

CardProducto.propTypes = {
  producto: PropTypes.object.isRequired,
};

export default CardProducto;
