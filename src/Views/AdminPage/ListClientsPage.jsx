import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNotification } from "../../hooks/useNotification";
import { URL_BASE } from "../../config/config";
import ClientEditDialog from "./ClientEditDialog";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  StoreMallDirectory as StoreIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Grid3x3 as GridID,
} from "@mui/icons-material";

const ListClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editClient, setEditClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const { request } = useFetch();
  const { showNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await request(`${URL_BASE}/clientes`, "GET", null);

      if (response.error) {
        showNotification({
          message: "Error al cargar los datos",
          severity: "error",
        });
      } else {
        setClients(response.data);
      }
    } catch (error) {
      console.log(error);
      showNotification({
        message: "Error al cargar los datos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterClients = () => {
      const filtered = clients.filter(
        (client) =>
          client.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    };
    filterClients();
  }, [clients, searchTerm]);

  const handleEdit = (client) => {
    setEditClient(client);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await request(`${URL_BASE}/clientes/${clientToDelete.idClientes}`, "DELETE", null);

      if (response.error) {
        showNotification({
          message: response.error || "Error al eliminar el cliente",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Cliente eliminado exitosamente",
          severity: "success",
        });
        fetchData();
      }
    } catch (error) {
      console.log(error);
      showNotification({
        message: "Error al eliminar el cliente",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await request(`${URL_BASE}/clientes/${editClient.idClientes}`, "PUT", updatedData);

      if (response.error) {
        showNotification({
          message: response.error || "Error al actualizar el cliente",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Cliente actualizado exitosamente",
          severity: "success",
        });
        setEditClient(null);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      showNotification({
        message: "Error al actualizar el cliente",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100vw">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Listado de Clientes
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Buscar por razón social o nombre comercial"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <GridID style={{ marginRight: "8px" }} /> ID
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <BusinessIcon style={{ marginRight: "8px" }} /> Razón Social
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StoreIcon style={{ marginRight: "8px" }} /> Nombre Comercial
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <LocationIcon style={{ marginRight: "8px" }} /> Dirección
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <PhoneIcon style={{ marginRight: "8px" }} /> Teléfono
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MailIcon style={{ marginRight: "8px" }} /> Email
                </div>
              </TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.idClientes}>
                <TableCell>{client.idClientes}</TableCell>
                <TableCell>{client.razon_social}</TableCell>
                <TableCell>{client.nombre_comercial}</TableCell>
                <TableCell>{client.direccion_entrega}</TableCell>
                <TableCell>{client.telefono}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell align="center">
                  <Box>
                    <IconButton onClick={() => handleEdit(client)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(client)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editClient && <ClientEditDialog open={!!editClient} onClose={() => setEditClient(null)} client={editClient} onSave={handleSave} />}

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el cliente &quot;{clientToDelete?.razon_social}&quot;? ¡ESTA OPCIÓN NO SE PUEDE DESHACER!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListClientsPage;
