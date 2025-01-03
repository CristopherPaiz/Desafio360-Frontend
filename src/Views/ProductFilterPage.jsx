import { useState, useEffect } from "react";
import { Box, Slider, Typography, FormControl, InputLabel, Select, MenuItem, Container, Paper, CircularProgress } from "@mui/material";
import { URL_BASE } from "../config/config";
import CardProducto from "../components/CardProducto";
import useFetch from "../hooks/useFetch";

const ProductsFilterPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [stockRange, setStockRange] = useState([0, 100]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const { request } = useFetch();

  const getCategoryId = () => {
    const path = window.location.pathname;
    const segments = path.split("/");
    return segments[segments.length - 1];
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryId = getCategoryId();
        const response = await request(`${URL_BASE}/productos/filtro?idCategoria=${categoryId}`, "GET", null);

        if (!response.error) {
          setProducts(response.data);
          setFilteredProducts(response.data);

          const maxPrice = Math.max(...response.data.map((p) => p.precio));
          setPriceRange([0, maxPrice]);

          const maxStock = Math.max(...response.data.map((p) => p.stock));
          setStockRange([0, maxStock]);
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [request]);

  const brands = [...new Set(products.map((product) => product.marca))];

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesBrand = !selectedBrand || product.marca === selectedBrand;
      const matchesPrice = product.precio >= priceRange[0] && product.precio <= priceRange[1];
      const matchesStock = product.stock >= stockRange[0] && product.stock <= stockRange[1];

      return matchesBrand && matchesPrice && matchesStock;
    });

    setFilteredProducts(filtered);
  }, [selectedBrand, priceRange, stockRange, products]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ flex: { xs: "1", md: "0 0 25%" } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filtros
            </Typography>

            <Box sx={{ mb: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Marca</InputLabel>
                <Select value={selectedBrand} label="Marca" onChange={(e) => setSelectedBrand(e.target.value)}>
                  <MenuItem value="">Todas</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography gutterBottom>Rango de Precio</Typography>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={Math.max(...products.map((p) => p.precio))}
                valueLabelFormat={(value) => `Q${value}`}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Q{priceRange[0]}</Typography>
                <Typography variant="body2">Q{priceRange[1]}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography gutterBottom>Rango de Stock</Typography>
              <Slider
                value={stockRange}
                onChange={(_, newValue) => setStockRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={Math.max(...products.map((p) => p.stock))}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">{stockRange[0]} unidades</Typography>
                <Typography variant="body2">{stockRange[1]} unidades</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {products[0]?.categoria}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {filteredProducts.map((product) => (
              <Box
                key={product.idProductos}
                sx={{
                  flex: "0 0 calc(33.333% - 16px)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CardProducto producto={product} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsFilterPage;
