import { Box, Typography, IconButton } from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material";
import { useCart } from "../../context/CartContext";
import PropTypes from "prop-types";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        px: 4,
        borderBottom: "1px solid #eee",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <img
          src={item.foto}
          alt={item.nombre}
          style={{
            width: 80,
            height: 80,
            objectFit: "contain",
            marginRight: 16,
            borderRadius: 1,
          }}
        />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {item.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Marca: {item.marca}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Código: {item.codigo}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body1">Q {item.precio.toFixed(2)}</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            px: 1,
          }}
        >
          <IconButton size="small" onClick={() => updateQuantity(item, Math.max(1, (item.cantidad || 1) - 1))} disabled={(item.cantidad || 1) <= 1}>
            <Remove />
          </IconButton>
          <Typography sx={{ minWidth: "30px", textAlign: "center" }}>{item.cantidad || 1}</Typography>
          <IconButton size="small" onClick={() => updateQuantity(item, (item.cantidad || 1) + 1)} disabled={(item.cantidad || 1) >= item.stock}>
            <Add />
          </IconButton>
        </Box>

        <Typography variant="body1" sx={{ minWidth: "80px", textAlign: "right" }}>
          Q {((item.cantidad || 1) * item.precio).toFixed(2)}
        </Typography>

        <IconButton size="small" onClick={() => removeFromCart(item)} sx={{ color: "error.main" }}>
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default CartItem;
