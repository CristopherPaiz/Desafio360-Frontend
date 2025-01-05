import { useEffect, useState } from "react";
import { Box, CircularProgress, List, ListItem, ListItemIcon, Typography, Modal, Paper, Divider } from "@mui/material";
import {
  Info as InfoIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../hooks/useNotification";
import { URL_BASE } from "../config/config";

const ESTADOS = {
  1: { nombre: "Activo", color: "#2196F3" },
  5: { nombre: "Aprobado", color: "#4CAF50" },
  2: { nombre: "Inactivo", color: "#ffae00" },
  4: { nombre: "Pendiente", color: "#8d8d8d" },
  6: { nombre: "Tránsito", color: "#891aff" },
};

const OrdenesClient = () => {
  const { request } = useFetch();
  const { userData } = useAuth();
  const { showNotification } = useNotification();

  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await request(`${URL_BASE}/ordenes/user/${userData.idusuarios}`, "GET");
        if (response.error) {
          showNotification({
            message: response.error || "Error al obtener las órdenes",
            severity: "error",
          });
        } else {
          setOrdenes(response.data || []);
        }
      } catch (error) {
        console.log(error);
        showNotification({
          message: "Error al realizar la solicitud",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, [request, userData.idusuarios, showNotification]);

  const handleOrdenClick = async (idOrden) => {
    try {
      const response = await request(`${URL_BASE}/ordenes/${idOrden}`, "GET");
      if (response.error) {
        showNotification({
          message: response.error || "Error al obtener los detalles de la orden",
          severity: "error",
        });
      } else {
        setSelectedOrden(response.data);
        setModalOpen(true);
      }
    } catch (error) {
      console.log(error);
      showNotification({
        message: "Error al realizar la solicitud",
        severity: "error",
      });
    }
  };

  const renderEstado = (estado) => {
    const estadoInfo = Object.values(ESTADOS).find((e) => e.nombre === estado) || { color: "#000" };
    return (
      <Typography
        variant="body2"
        style={{
          color: estadoInfo.color,
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        {estado}
      </Typography>
    );
  };

  return (
    <Box padding={2}>
      {loading ? (
        <CircularProgress />
      ) : ordenes.length === 0 ? (
        <Typography>No hay órdenes disponibles</Typography>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Mis Órdenes
          </Typography>
          <List>
            {ordenes.map((orden) => (
              <ListItem
                key={orden.idOrden}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  marginBottom: 16,
                  padding: 16,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => handleOrdenClick(orden.idOrden)}
              >
                <ListItemIcon>
                  <InfoIcon style={{ color: ESTADOS[orden.estado]?.color }} />
                </ListItemIcon>
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom>
                    Orden #{orden.idOrden}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <MoneyIcon />
                    <Typography variant="body2">Total: Q{orden.total_orden.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon />
                    <Typography variant="body2">Fecha Entrega: {orden.fecha_entrega}</Typography>
                  </Box>
                  {renderEstado(orden.estado)}
                </Box>
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper
          style={{
            maxWidth: 600,
            margin: "100px auto",
            padding: "24px",
            outline: "none",
          }}
        >
          {selectedOrden && (
            <>
              <Typography variant="h6" gutterBottom>
                Detalles de la Orden #{selectedOrden.idOrden}
              </Typography>
              <Divider style={{ marginBottom: 16 }} />
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon />
                <Typography variant="body1">Cliente: {selectedOrden.nombre_completo}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <HomeIcon />
                <Typography variant="body1">Dirección: {selectedOrden.direccion}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon />
                <Typography variant="body1">Teléfono: {selectedOrden.telefono}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon />
                <Typography variant="body1">Correo: {selectedOrden.correo_electronico}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <MoneyIcon />
                <Typography variant="body1">Total: Q{selectedOrden.total_orden.toFixed(2)}</Typography>
              </Box>
              <Divider style={{ margin: "16px 0" }} />
              <Typography variant="h6">Productos</Typography>
              {selectedOrden.detalles.map((detalle) => (
                <Box
                  key={detalle.idOrdenDetalles}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  padding={1}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <Typography variant="body2">{detalle.nombre_producto}</Typography>
                  <Typography variant="body2">
                    {detalle.cantidad} x Q{detalle.precio.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default OrdenesClient;
