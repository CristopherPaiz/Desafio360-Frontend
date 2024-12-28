import { Box, Skeleton } from "@mui/material";
import PropTyps from "prop-types";

const PRODUCTOS_POR_FILA = 4;

const ProductosPorCategoriaSkeleton = ({ cantidadCategorias }) => {
  return (
    <>
      {[...Array(cantidadCategorias)].map((_, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            {[...Array(PRODUCTOS_POR_FILA)].map((_, idx) => (
              <Box key={idx} sx={{ flex: 1 }}>
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
};

ProductosPorCategoriaSkeleton.propTypes = {
  cantidadCategorias: PropTyps.number.isRequired,
};

export default ProductosPorCategoriaSkeleton;
