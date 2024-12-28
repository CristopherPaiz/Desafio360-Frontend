import { useEffect, useState } from "react";
import { Container, Card, CardMedia, CardContent, Typography, Button, Backdrop, CircularProgress, Box, Breadcrumbs, Link } from "@mui/material";
import { LocalOffer, Category, Inventory, ShoppingCart, Store } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom"; // Usamos Link de React Router
import useFetch from "../hooks/useFetch";
import { URL_BASE } from "../config/config";
import { useNotification } from "../hooks/useNotification";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0); // Controla el número de intentos
  const { request } = useFetch();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      // Obtiene el ID del producto desde la URL
      const pathname = window.location.pathname;
      const productId = pathname.split("/").pop(); // Extrae la última parte de la URL

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

        // Incrementa el número de intentos si falla y detén tras dos intentos
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
        <RouterLink to="/" style={{ textDecoration: "none" }}>
          <Link underline="hover" color="inherit" sx={{ cursor: "pointer", color: "text.primary" }}>
            Inicio
          </Link>
        </RouterLink>
        <RouterLink to="/productos" style={{ textDecoration: "none" }}>
          <Link underline="hover" color="inherit" sx={{ cursor: "pointer", color: "text.primary" }}>
            Productos
          </Link>
        </RouterLink>
        <RouterLink to={`/categorias`} style={{ textDecoration: "none" }}>
          <Link underline="hover" color="inherit" sx={{ cursor: "pointer", color: "text.primary" }}>
            {product.categoria}
          </Link>
        </RouterLink>
        <Typography sx={{ color: "text.primary" }}>{product.nombre}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
        <Box sx={{ flex: "1 1 40%", padding: 2 }}>
          <Card>
            <CardMedia
              component="img"
              image={product.foto}
              alt={product.nombre}
              sx={{ height: 300, objectFit: "contain", width: "100%", margin: "0 auto", padding: 4 }}
            />
          </Card>
        </Box>

        {/* Información del producto */}
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
              <Button variant="contained" color="primary" size="large" disabled={product.stock === 0}>
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
