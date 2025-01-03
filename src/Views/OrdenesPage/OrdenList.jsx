import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Skeleton, Box } from "@mui/material";
import { CalendarMonth, Person, Close, Contacts, PointOfSale, Grid3x3 } from "@mui/icons-material";

const OrdenList = ({ ordenes, onOrdenClick, loading }) => {
  if (loading) {
    return Array.from(new Array(5)).map((_, index) => <Skeleton key={index} variant="rectangular" height={53} sx={{ mb: 1 }} />);
  }

  if (ordenes.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Close size={48} />
        </Box>
        <Typography variant="h6">No hay órdenes en este estado</Typography>
        <Typography color="text.secondary">Las órdenes que cambien a este estado aparecerán aquí</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ px: 4 }}>
          <TableRow>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Grid3x3 size={16} />
                ID
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person size={16} />
                Cliente
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonth size={16} />
                Fecha
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Contacts size={16} />
                Contacto
              </Box>
            </TableCell>
            <TableCell align="right">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
                <PointOfSale size={16} />
                Total
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ px: 4 }}>
          {ordenes.map((orden) => (
            <TableRow
              key={orden.idOrden}
              onClick={() => onOrdenClick(orden.idOrden)}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  "& .orden-id": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" className="orden-id" sx={{ fontWeight: "medium" }}>
                  #{orden.idOrden.toString().padStart(4, "0")}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{orden.nombre_completo}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {orden.direccion}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">Creación: {new Date(orden.fecha_creacion).toLocaleDateString()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Entrega: {new Date(orden.fecha_entrega).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{orden.telefono}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {orden.correo_electronico}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {orden.total_orden.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

OrdenList.propTypes = {
  ordenes: PropTypes.array,
  onOrdenClick: PropTypes.func,
  loading: PropTypes.bool,
  estadoConfig: PropTypes.object,
};

export default OrdenList;
