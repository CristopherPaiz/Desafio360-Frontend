import { useState, useEffect } from "react";
import { Box, Grid, Slider, Typography, FormControl, InputLabel, Select, MenuItem, Container, Paper, CircularProgress } from "@mui/material";
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

  // Get category ID from URL
  const getCategoryId = () => {
    const path = window.location.pathname;
    const segments = path.split("/");
    return segments[segments.length - 1];
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryId = getCategoryId();
        const response = await request(`${URL_BASE}/productos/filtro?idCategoria=${categoryId}`, "GET", null);

        if (!response.error) {
          setProducts(response.data);
          setFilteredProducts(response.data);

          // Set initial price range based on products
          const maxPrice = Math.max(...response.data.map((p) => p.precio));
          setPriceRange([0, maxPrice]);

          // Set initial stock range based on products
          const maxStock = Math.max(...response.data.map((p) => p.stock));
          setStockRange([0, maxStock]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique brands for filter
  const brands = [...new Set(products.map((product) => product.marca))];

  // Apply filters
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
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filtros
            </Typography>

            {/* Brand Filter */}
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

            {/* Price Range Filter */}
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

            {/* Stock Range Filter */}
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
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.idProductos}>
                <CardProducto producto={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductsFilterPage;
