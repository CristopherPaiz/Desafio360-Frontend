import { useEffect, useState } from "react";
import { Container, Card, CardMedia, CardContent, Typography, Button, Backdrop, CircularProgress, Box, Breadcrumbs } from "@mui/material";
import { LocalOffer, Category, Inventory, ShoppingCart, Store } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { URL_BASE } from "../config/config";
import { useNotification } from "../hooks/useNotification";
import { useCart } from "../context/CartContext";
import useIsSmallScreen from "../hooks/useIsSmallScreen";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const { request } = useFetch();
  const { showNotification } = useNotification();
  const { addToCart } = useCart();
  const isSmallScreen = useIsSmallScreen();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const pathname = window.location.pathname;
      const productId = pathname.split("/").pop();

      if (!productId) {
        showNotification({
          message: "No se pudo determinar el ID del producto.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      const response = await request(`${URL_BASE}/productos/id/${productId}`, "GET", null);

      if (response.error) {
        showNotification({
          message: response?.error || "Error al cargar el producto",
          severity: "error",
        });

        setAttempts((prev) => {
          if (prev < 1) {
            return prev + 1;
          } else {
            setLoading(false);
            return prev;
          }
        });
      } else {
        setProduct(response.data);
        setLoading(false);
      }
    };

    if (attempts < 2 && !product) {
      fetchProduct();
    }
  }, [attempts, product, request, showNotification]);

  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
          Producto no encontrado.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <RouterLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Inicio
        </RouterLink>
        <RouterLink to="/productos" style={{ textDecoration: "none", color: "inherit" }}>
          Productos
        </RouterLink>
        <RouterLink to={`/categorias`} style={{ textDecoration: "none", color: "inherit" }}>
          {product.categoria}
        </RouterLink>
        <Typography sx={{ color: "text.primary" }}>{product.nombre}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 4,
        }}
      >
        <Box sx={{ flex: isSmallScreen ? "1 1 auto" : "1 1 40%", padding: 2 }}>
          <Card>
            <CardMedia
              component="img"
              image={product.foto}
              alt={product.nombre}
              sx={{
                height: 300,
                objectFit: "contain",
                width: "100%",
                margin: "0 auto",
                padding: 4,
              }}
            />
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 60%", padding: 0 }}>
          <Card>
            <CardContent sx={{ px: 4, pt: 4 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                {product.nombre}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                <Store sx={{ fontSize: 18, mr: 1 }} />
                {product.marca} | Código: {product.codigo}
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                <Category sx={{ fontSize: 18, mr: 1 }} />
                Categoría: {product.categoria}
              </Typography>
              <Typography variant="h5" color="success.main" fontWeight={"bold"} sx={{ mb: 2 }}>
                <LocalOffer sx={{ fontSize: 24, mr: 2 }} />
                Precio: Q{product.precio.toFixed(2)}
              </Typography>
              <Typography variant="body1" color={product.stock > 0 ? "text.primary" : "error.main"} sx={{ mb: 2 }}>
                <Inventory sx={{ fontSize: 18, mr: 1 }} />
                {product.stock > 0 ? `Stock: ${product.stock} disponibles` : "Sin stock"}
              </Typography>
            </CardContent>
            <Box sx={{ px: 2, pb: 4, display: "flex", justifyContent: "center" }}>
              <Button variant="contained" color="primary" size="large" disabled={product.stock === 0} onClick={() => addToCart(product)}>
                <ShoppingCart sx={{ mr: 1 }} />
                Añadir al carrito
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductPage;
