import { useEffect, useState } from "react";
import { Box, Tab, Container, Tabs, Typography } from "@mui/material";
import { useNotification } from "../../hooks/useNotification";
import useFetch from "../../hooks/useFetch";
import { URL_BASE } from "../../config/config";
import OrdenList from "./OrdenList";
import OrdenDialog from "./OrdenDialog";
import { io } from "socket.io-client";

const OrdenesPage = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Pendiente");
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { showNotification } = useNotification();
  const { request } = useFetch();

  const ESTADOS = {
    1: { nombre: "Activo", color: "#2196F3" },
    5: { nombre: "Aprobado", color: "#4CAF50" },
    2: { nombre: "Inactivo", color: "#ffae00" },
    4: { nombre: "Pendiente", color: "#8d8d8d" },
    6: { nombre: "Tránsito", color: "#891aff" },
  };

  useEffect(() => {
    const socket = io(URL_BASE);

    const fetchOrdenes = async () => {
      const result = await request(`${URL_BASE}/ordenes`, "GET", null);
      if (result.error) {
        showNotification({
          message: result.error,
          severity: "error",
        });
      } else {
        setOrdenes(result.data);
      }
    };

    socket.on("ordenes:list", (data) => {
      setOrdenes(data);
    });

    socket.on("ordenes:created", (newOrden) => {
      setOrdenes((prev) => [...prev, newOrden]);
      showNotification({
        message: `Nueva orden creada por ${newOrden.usuario}`,
        color: "#4CAF50",
      });
    });

    socket.on("ordenes:statusChanged", (updatedOrden) => {
      if (updatedOrden && updatedOrden.idOrden) {
        setOrdenes((prev) => prev.map((orden) => (orden.idOrden === updatedOrden.idOrden ? updatedOrden : orden)));

        const estado = ESTADOS[updatedOrden.nuevo_estado] || { nombre: "Desconocido", color: "#000000" };

        showNotification({
          message: `Estado de orden #${updatedOrden.idOrden} cambiado a ${estado.nombre}`,
          color: estado.color,
        });
      }
    });

    socket.on("ordenes:deleted", (deletedId) => {
      setOrdenes((prev) => prev.filter((orden) => orden.idOrden !== deletedId));
      showNotification({
        message: `Orden #${deletedId.idOrden} eliminada`,
        color: "#F44336",
      });
    });

    fetchOrdenes();

    return () => {
      socket.disconnect();
    };
  }, [request, showNotification, selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOrdenClick = async (ordenId) => {
    const result = await request(`${URL_BASE}/ordenes/${ordenId}`, "GET", null);
    if (result.error) {
      showNotification({
        message: result.error,
        severity: "error",
      });
    } else {
      setSelectedOrden(result.data);
      setOpenDialog(true);
    }
  };

  const handleStatusChange = (updatedOrden) => {
    setOrdenes((prev) => prev.map((orden) => (orden.idOrden === updatedOrden.idOrden ? updatedOrden : orden)));
  };

  // ESTADOS PARA LAS TABS
  const estados = ["Pendiente", "Aprobado", "Tránsito", "Inactivo", "Activo"];

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Lista de Órdenes
      </Typography>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            {estados.map((estado) => (
              <Tab label={estado} value={estado} key={estado} />
            ))}
          </Tabs>
        </Box>
        {estados.map(
          (estado) =>
            selectedTab === estado && (
              <Box key={estado} role="tabpanel">
                <OrdenList ordenes={ordenes.filter((orden) => orden.estado === estado)} onOrdenClick={handleOrdenClick} />
              </Box>
            )
        )}
      </Box>

      <OrdenDialog open={openDialog} orden={selectedOrden} onClose={() => setOpenDialog(false)} onStatusChange={handleStatusChange} />
    </Container>
  );
};

export default OrdenesPage;
