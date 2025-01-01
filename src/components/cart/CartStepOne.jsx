import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";
import PropTypes from "prop-types";

const CartStepOne = ({ onNext }) => {
  const { cart, countItemsInCart } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.precio * (item.cantidad || 1), 0);
  };

  const handleNext = () => {
    // Preparar los datos en el formato requerido
    const detalles = cart.map((item) => ({
      Productos_idProductos: item.idProductos,
      cantidad: item.cantidad || 1,
      precio: item.precio,
    }));

    // Llamar a onNext con los datos formateados
    onNext({ detalles });
  };

  if (cart.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Button variant="contained" component={RouterLink} color="primary" to="/">
          Ir a comprar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
      <Box sx={{ flex: "1" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Productos en tu carrito</Typography>
          <Typography color="text.secondary">
            {countItemsInCart} {countItemsInCart === 1 ? "producto" : "productos"}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 1,
            overflow: "hidden",
          }}
        >
          {cart.map((item) => (
            <CartItem key={item.idProductos} item={item} />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: 300 },
          alignSelf: { xs: "stretch", md: "flex-start" },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Resumen de la orden
        </Typography>
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography>Subtotal:</Typography>
            <Typography>Q {calculateTotal().toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography fontWeight="bold">Total:</Typography>
            <Typography fontWeight="bold">Q {calculateTotal().toFixed(2)}</Typography>
          </Box>

          <Button variant="contained" fullWidth color="primary" onClick={handleNext} size="large">
            Continuar con la compra
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

CartStepOne.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default CartStepOne;
