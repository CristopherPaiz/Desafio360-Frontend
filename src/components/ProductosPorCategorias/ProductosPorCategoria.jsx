import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { URL_BASE } from "../../config/config";
import { useNotification } from "../../hooks/useNotification";
import CardProducto from "../CardProducto";
import ProductosPorCategoriaSkeleton from "./ProductosPorCategoriaSkeleton";

const CATEGORIAS_POR_MOSTRAR = 4;
const PRODUCTOS_POR_FILA = 4;

const ProductosPorCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const { showNotification } = useNotification();
  const { loading, request } = useFetch();
  const [categoriasConProductos, setCategoriasConProductos] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await request(`${URL_BASE}/categorias/activas`, "GET", null);
      if (response.error) {
        showNotification({
          message: response?.error,
          severity: "error",
        });
      } else {
        const categoriasAleatorias = [...response.data].sort(() => Math.random() - 0.5);
        setCategorias(categoriasAleatorias);
      }
    };

    fetchCategorias();
  }, [showNotification, request]);

  useEffect(() => {
    const fetchProductosPorCategoria = async () => {
      const productosTemp = {};
      const categoriasValidas = [];

      for (const categoria of categorias) {
        if (categoriasValidas.length >= CATEGORIAS_POR_MOSTRAR) break;

        const response = await request(`${URL_BASE}/productos/filtro-paginado?page=1&size=${PRODUCTOS_POR_FILA}&categoria_nombre=${categoria.nombre}`, "GET", null);

        if (!response.error) {
          const productosActivos = response.data.productos.filter((producto) => producto.estado === "Activo");

          if (productosActivos.length > 0) {
            productosTemp[categoria.nombre] = productosActivos;
            categoriasValidas.push(categoria);
          }
        }
      }

      setProductosPorCategoria(productosTemp);
      setCategoriasConProductos(categoriasValidas);
    };

    if (categorias.length > 0) {
      fetchProductosPorCategoria();
    }
  }, [categorias, request]);

  return (
    <Box>
      {loading && !categoriasConProductos.length ? (
        <ProductosPorCategoriaSkeleton cantidadCategorias={CATEGORIAS_POR_MOSTRAR} />
      ) : (
        categoriasConProductos.map((categoria) => (
          <Box
            key={categoria.idCategoriaProductos}
            sx={{ mb: 4, backgroundColor: "grey.50", borderRadius: 2, p: 3, boxShadow: "0 0 10px rgba(0,0,0,0.05)", my: 4 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h4" component="h2">
                {categoria.nombre}
              </Typography>
              <Button component={Link} to={`/categorias/${categoria.idCategoriaProductos}`} variant="text" color="primary">
                Ver todo
              </Button>
            </Box>

            {loading ? (
              <ProductosPorCategoriaSkeleton cantidadCategorias={1} />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {productosPorCategoria[categoria.nombre]?.map((producto) => (
                  <Box
                    key={producto.idProductos}
                    sx={{
                      flex: {
                        xs: "0 0 100%",
                        sm: "0 0 calc(50% - 8px)",
                        md: `0 0 calc(${100 / PRODUCTOS_POR_FILA}% - 12px)`,
                      },
                    }}
                  >
                    <CardProducto producto={producto} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default ProductosPorCategoria;
