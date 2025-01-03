import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Stack, Paper } from "@mui/material";
import { categoryIcons } from "./IconsMapping";
import CategoriasSkeleton from "./CategoriasSkeleton";
import useFetch from "../../hooks/useFetch";
import { URL_BASE } from "../../config/config";
import { useNotification } from "../../hooks/useNotification";

const CategoriasBarra = () => {
  const [categorias, setCategorias] = useState([]);
  const { showNotification } = useNotification();
  const { loading, request } = useFetch();

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await request(`${URL_BASE}/categorias/activas`, "GET", null);
      if (response.error) {
        showNotification({
          message: response?.error,
          severity: "error",
        });
      } else {
        setCategorias(response.data);
      }
    };

    fetchCategorias();
  }, [showNotification, request]);

  if (loading) {
    return <CategoriasSkeleton />;
  }

  return (
    <>
      <Typography variant="h5" align="left" gutterBottom>
        Categorías
      </Typography>
      <Paper elevation={1}>
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Stack
            direction="row"
            spacing={3}
            sx={{
              p: 2,
              minWidth: "max-content",
            }}
          >
            {categorias.map((categoria) => {
              const IconComponent = categoryIcons[categoria.nombre] || categoryIcons["default"];

              return (
                <Link
                  key={categoria.idCategoriaProductos}
                  to={`/categorias/${categoria.idCategoriaProductos}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Stack
                    alignItems="center"
                    spacing={1}
                    sx={{
                      minWidth: 80,
                      cursor: "pointer",
                      transition: "transform 0.2s, opacity 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        opacity: 0.8,
                      },
                    }}
                  >
                    <IconComponent
                      sx={{
                        fontSize: 40,
                        color: "gray",
                      }}
                    />
                    <Typography
                      variant="caption"
                      align="center"
                      sx={{
                        maxWidth: 80,
                        whiteSpace: "normal",
                      }}
                    >
                      {categoria.nombre}
                    </Typography>
                  </Stack>
                </Link>
              );
            })}
          </Stack>
        </Box>
      </Paper>
    </>
  );
};

export default CategoriasBarra;
