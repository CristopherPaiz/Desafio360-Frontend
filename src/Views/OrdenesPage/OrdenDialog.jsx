import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  DialogContentText,
  Dialog as ConfirmationDialog,
} from "@mui/material";
import { useNotification } from "../../hooks/useNotification";
import useFetch from "../../hooks/useFetch";
import { URL_BASE } from "../../config/config";
import { CheckCircle, LocalShipping, Close, RemoveShoppingCart, Refresh, DeleteForever } from "@mui/icons-material";
import { useState } from "react";

const OrdenDialog = ({ open, orden, onClose, onStatusChange }) => {
  const { showNotification } = useNotification();
  const { request } = useFetch();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const estadosMap = {
    Activo: 1,
    Aprobado: 5,
    Inactivo: 2,
    Pendiente: 4,
    Suspendido: 3,
    Tránsito: 6,
  };

  const handleStatusChange = async (newStatus) => {
    const data = { estados_idestados: estadosMap[newStatus] };
    const result = await request(`${URL_BASE}/ordenes/estado/${orden.idOrden}`, "PUT", data);

    if (result.error) {
      showNotification({
        message: result.error,
        severity: "error",
      });
    } else {
      const updatedOrden = { ...orden, estado: newStatus };
      onStatusChange(updatedOrden);
      onClose();
    }
  };

  const handleDelete = async () => {
    const result = await request(`${URL_BASE}/ordenes/${orden.idOrden}`, "DELETE");

    if (result.error) {
      showNotification({
        message: result.error,
        severity: "error",
      });
    } else {
      onClose();
    }
    setConfirmDeleteOpen(false);
  };

  const getStatusButtons = () => {
    switch (orden.estado) {
      case "Pendiente":
        return (
          <Button onClick={() => handleStatusChange("Aprobado")} color="success" startIcon={<CheckCircle />}>
            Aprobar
          </Button>
        );

      case "Aprobado":
        return (
          <>
            <Button onClick={() => handleStatusChange("Pendiente")} color="warning" startIcon={<Refresh />}>
              Regresar a Pendiente
            </Button>
            <Button onClick={() => handleStatusChange("Tránsito")} color="info" startIcon={<LocalShipping />}>
              Marcar en Tránsito
            </Button>
          </>
        );

      case "Tránsito":
        return (
          <Button onClick={() => handleStatusChange("Inactivo")} color="error" startIcon={<RemoveShoppingCart />}>
            Inactivar
          </Button>
        );

      case "Inactivo":
        return (
          <Button onClick={() => handleStatusChange("Pendiente")} color="warning" startIcon={<Refresh />}>
            Regresar a Pendiente
          </Button>
        );

      case "Activo":
        return (
          <>
            <Button onClick={() => handleStatusChange("Inactivo")} color="error" startIcon={<RemoveShoppingCart />}>
              Inactivar
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  if (!orden) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">Orden #{orden.idOrden}</Typography>
            <Chip
              label={orden.estado}
              color={
                orden.estado === "Pendiente"
                  ? "warning"
                  : orden.estado === "Aprobado"
                  ? "success"
                  : orden.estado === "Tránsito"
                  ? "info"
                  : orden.estado === "Inactivo"
                  ? "error"
                  : "default"
              }
              variant="outlined"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">Información del Cliente</Typography>
              <Typography>Nombre: {orden.nombre_completo}</Typography>
              <Typography>Dirección: {orden.direccion}</Typography>
              <Typography>Teléfono: {orden.telefono}</Typography>
              <Typography>Email: {orden.correo_electronico}</Typography>
            </Box>
            <Box>
              <Typography variant="h6">Detalles de la Orden</Typography>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Código</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orden.detalles.map((detalle) => (
                      <TableRow key={detalle.idOrdenDetalles}>
                        <TableCell>{detalle.nombre_producto}</TableCell>
                        <TableCell>{detalle.codigo_producto}</TableCell>
                        <TableCell align="right">{detalle.cantidad}</TableCell>
                        <TableCell align="right">{detalle.precio.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })}</TableCell>
                        <TableCell align="right">{detalle.subtotal.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        <Typography variant="subtitle1">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1">
                          {orden.total_orden.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(true)} color="error" startIcon={<DeleteForever />}>
            Eliminar definitivamente
          </Button>
          
          <Button onClick={onClose} startIcon={<Close />}>
            Cerrar
          </Button>
          {getStatusButtons()}
        </DialogActions>
      </Dialog>
      <ConfirmationDialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} sx={{ padding: 4 }}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Está seguro de que desea eliminar esta orden? Los datos se regresarán al stock.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="main">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </ConfirmationDialog>
    </>
  );
};

OrdenDialog.propTypes = {
  open: PropTypes.bool,
  orden: PropTypes.object,
  onClose: PropTypes.func,
  onStatusChange: PropTypes.func,
};

export default OrdenDialog;
