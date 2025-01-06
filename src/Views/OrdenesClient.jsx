import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  ListItem,
  Typography,
  Modal,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import {
  Person as PersonIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Cancel as CancelIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../hooks/useNotification";
import { URL_BASE } from "../config/config";
import PropTypes from "prop-types";

const ESTADOS = {
  1: {
    nombre: "Activo",
    color: "primary",
    bgColor: "rgba(33, 150, 243, 0.1)",
    icon: <CartIcon color="primary" />,
  },
  5: {
    nombre: "Aprobado",
    color: "success",
    bgColor: "rgba(76, 175, 80, 0.1)",
    icon: <AssignmentIcon color="success" />,
  },
  2: {
    nombre: "Inactivo",
    color: "warning",
    bgColor: "rgba(255, 174, 0, 0.1)",
    icon: <CancelIcon color="warning" />,
  },
  4: {
    nombre: "Pendiente",
    color: "default",
    bgColor: "rgba(141, 141, 141, 0.1)",
    icon: <ScheduleIcon color="action" />,
  },
  6: {
    nombre: "Tránsito",
    color: "secondary",
    bgColor: "rgba(137, 26, 255, 0.1)",
    icon: <ShippingIcon color="secondary" />,
  },
};

const OrdenesClient = () => {
  const { request } = useFetch();
  const { userData } = useAuth();
  const { showNotification } = useNotification();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [ordenToCancel, setOrdenToCancel] = useState(null);

  const fetchOrdenes = async () => {
    try {
      const response = await request(`${URL_BASE}/ordenes/user/${userData.idusuarios}`, "GET");
      if (response.error) {
        showNotification({ message: response.error, severity: "error" });
      } else {
        setOrdenes(response.data || []);
      }
    } catch (error) {
      console.log(error);
      showNotification({ message: "Error al obtener órdenes", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const handleOrdenClick = async (idOrden) => {
    try {
      const response = await request(`${URL_BASE}/ordenes/${idOrden}`, "GET");
      if (response.error) {
        showNotification({ message: response.error, severity: "error" });
      } else {
        setSelectedOrden(response.data);
        setModalOpen(true);
      }
    } catch (error) {
      console.log(error);
      showNotification({ message: "Error al obtener detalles", severity: "error" });
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await request(`${URL_BASE}/ordenes/${ordenToCancel}`, "DELETE");
      if (response.error) {
        showNotification({ message: response.error, severity: "error" });
      } else {
        showNotification({ message: "Orden cancelada exitosamente", severity: "success" });
        fetchOrdenes();
        setModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      showNotification({ message: "Error al cancelar orden", severity: "error" });
    } finally {
      setCancelDialogOpen(false);
      setOrdenToCancel(null);
    }
  };

  const OrderCard = ({ orden }) => {
    const estadoID = Object.keys(ESTADOS).find((key) => ESTADOS[key].nombre === orden.estado);
    const estadoInfo = ESTADOS[estadoID] || ESTADOS[4];

    return (
      <Box sx={{ width: "100%", mb: 2 }}>
        <ListItem
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            p: 3,
            transition: "all 0.3s ease",
            backgroundColor: estadoInfo.bgColor,
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transform: "translateY(-2px)",
            },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box onClick={() => handleOrdenClick(orden.idOrden)} sx={{ cursor: "pointer", flex: 1 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {estadoInfo.icon}
              <Typography variant="h6">Orden #{orden.idOrden}</Typography>
              <Chip label={orden.estado} color={estadoInfo.color} sx={{ fontWeight: "bold" }} />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              <InfoRow icon={<PaymentIcon />} text={`Q${orden.total_orden.toFixed(2)}`} />
              <InfoRow icon={<CalendarIcon />} text={orden.fecha_entrega} />
              <InfoRow icon={<LocationIcon />} text={orden.direccion || "No especificada"} />
              <InfoRow icon={<PhoneIcon />} text={orden.telefono || "No especificado"} />
            </Box>
          </Box>
          {orden.estado === "Pendiente" && (
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setOrdenToCancel(orden.idOrden);
                setCancelDialogOpen(true);
              }}
            >
              <CancelIcon />
            </IconButton>
          )}
        </ListItem>
      </Box>
    );
  };

  const InfoRow = ({ icon, text }) => (
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography variant="body2">{text}</Typography>
    </Box>
  );

  InfoRow.propTypes = {
    icon: PropTypes.element,
    text: PropTypes.string,
  };

  if (!ordenes.length) {
    return (
      <Box>
        <Typography variant="h4">No hay órdenes</Typography>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
            Mis Órdenes
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            {ordenes.map((orden) => (
              <OrderCard key={orden.idOrden} orden={orden} />
            ))}
          </Box>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            p: 4,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          {selectedOrden && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Orden #{selectedOrden.idOrden}</Typography>
                {selectedOrden.estado === "Pendiente" && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setOrdenToCancel(selectedOrden.idOrden);
                      setCancelDialogOpen(true);
                    }}
                  >
                    Cancelar Pedido
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <InfoRow icon={<PersonIcon />} text={selectedOrden.nombre_completo} />
                <InfoRow icon={<HomeIcon />} text={selectedOrden.direccion} />
                <InfoRow icon={<PhoneIcon />} text={selectedOrden.telefono} />
                <InfoRow icon={<EmailIcon />} text={selectedOrden.correo_electronico} />
                <InfoRow icon={<MoneyIcon />} text={`Q${selectedOrden.total_orden.toFixed(2)}`} />
              </Grid>
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Productos
              </Typography>
              <Box>
                {selectedOrden.detalles.map((detalle) => (
                  <Paper
                    key={detalle.idOrdenDetalles}
                    sx={{
                      p: 2,
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{detalle.nombre_producto}</Typography>
                    <Typography>
                      {detalle.cantidad} x Q{detalle.precio.toFixed(2)}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </>
          )}
        </Paper>
      </Modal>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Confirmar Cancelación</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro que desea cancelar esta orden?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
          <Button onClick={handleCancelOrder} color="error" variant="contained">
            Sí, Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

OrdenesClient.propTypes = {
  orden: PropTypes.object,
};

export default OrdenesClient;
