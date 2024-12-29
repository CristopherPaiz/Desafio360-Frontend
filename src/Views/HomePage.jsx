import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import CategoriasBarra from "../components/CategoriasBarra/CategoriasBarra";
import ProductosPorCategoria from "../components/ProductosPorCategorias/ProductosPorCategoria";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Cuando isAuthenticated cambie y sea true, marcamos como listo
    if (isAuthenticated) {
      setIsReady(true);
    }
  }, [isAuthenticated]);

  if (!isReady) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CategoriasBarra />
      <ProductosPorCategoria key={isReady ? "loaded" : "loading"} />
    </>
  );
};

export default HomePage;
