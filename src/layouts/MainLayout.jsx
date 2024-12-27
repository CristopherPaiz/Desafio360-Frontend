import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const { countItemsInCart } = useCart();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar cartItemsCount={countItemsInCart} handleLogout={handleLogout} />
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
