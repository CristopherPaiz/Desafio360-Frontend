import { Box, Container } from "@mui/material";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const MainLayout = ({ children }) => {
  const { logout, userType } = useAuth();
  const { countItemsInCart } = useCart();

  const handleLogout = () => {
    logout(); // Usamos la función logout del contexto que ya maneja todo
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar
        cartItemsCount={countItemsInCart}
        handleLogout={handleLogout}
        userType={userType} // Pasamos el tipo de usuario al Navbar si lo necesitas
      />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
