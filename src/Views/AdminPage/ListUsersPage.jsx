import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNotification } from "../../hooks/useNotification";
import { URL_BASE } from "../../config/config";
import UserEditDialog from "./UserEditDialog";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Grid3x3 as GridID,
  Person as PersonIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

const ListUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("nombre_completo");

  const { request } = useFetch();
  const { showNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, estadosResponse] = await Promise.all([
        request(`${URL_BASE}/usuarios`, "GET", null),
        request(`${URL_BASE}/estados`, "GET", null),
      ]);

      if (usersResponse.error || estadosResponse.error) {
        showNotification({
          message: "Error al cargar los datos",
          severity: "error",
        });
      } else {
        setUsers(usersResponse.data);
        setEstados(estadosResponse.data);
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
    const filterUsers = () => {
      const activeUsers = users.filter((user) => user.estado === "Activo");
      const inactiveUsers = users.filter((user) => user.estado === "Inactivo");

      const filterActive = (rol) => {
        return activeUsers
          .filter((user) => user.rol === rol)
          .filter((user) => user[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      };

      const filterInactive = (rol) => {
        return inactiveUsers
          .filter((user) => user.rol === rol)
          .filter((user) => user[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      };

      setFilteredUsers({
        active: {
          clientes: filterActive("Cliente"),
          operadores: filterActive("Operador"),
          administradores: filterActive("Administrador"),
        },
        inactive: {
          clientes: filterInactive("Cliente"),
          operadores: filterInactive("Operador"),
          administradores: filterInactive("Administrador"),
        },
      });
    };
    filterUsers();
  }, [users, searchTerm, searchField]);

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await request(`${URL_BASE}/usuarios/${editUser.idusuarios}`, "PUT", updatedData);

      if (response.error) {
        showNotification({
          message: response.error || "Error al actualizar el usuario",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Usuario actualizado exitosamente",
          severity: "success",
        });
        setEditUser(null);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      showNotification({
        message: "Error al actualizar el usuario",
        severity: "error",
      });
    }
  };

  const renderTable = (users) => (
    <TableContainer>
      <Table sx={{ minWidth: 950 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <GridID />
            </TableCell>
            <TableCell>
              <PersonIcon /> Nombre
            </TableCell>
            <TableCell>
              <MailIcon /> Correo
            </TableCell>
            <TableCell>
              <PhoneIcon /> Teléfono
            </TableCell>
            <TableCell align="center">
              <SettingsIcon />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.idusuarios}>
              <TableCell>{user.idusuarios}</TableCell>
              <TableCell>{user.nombre_completo}</TableCell>
              <TableCell>{user.correo_electronico}</TableCell>
              <TableCell>{user.telefono}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleEdit(user)} color="primary">
                  <EditIcon />
                  <Typography>Editar</Typography>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
        Listado de Usuarios
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField label="Buscar" variant="outlined" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Box>
          <FormControlLabel
            control={<Checkbox checked={searchField === "nombre_completo"} onChange={() => setSearchField("nombre_completo")} />}
            label="Nombre"
          />
          <FormControlLabel
            control={<Checkbox checked={searchField === "correo_electronico"} onChange={() => setSearchField("correo_electronico")} />}
            label="Correo"
          />
        </Box>
      </Box>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={"bold"} fontSize={"1.3rem"}>
            Clientes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{renderTable(filteredUsers.active?.clientes || [])}</AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={"bold"} fontSize={"1.3rem"}>
            Operadores
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{renderTable(filteredUsers.active?.operadores || [])}</AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={"bold"} fontSize={"1.3rem"}>
            Administradores
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{renderTable(filteredUsers.active?.administradores || [])}</AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={"bold"} fontSize={"1.3rem"}>
            Inactivos
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={"bold"} fontSize={"1.3rem"}>
                Clientes
              </Typography>
            </AccordionSummary>
            <AccordionDetails>{renderTable(filteredUsers.inactive?.clientes || [])}</AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={"bold"} fontSize={"1.3rem"}>
                Operadores
              </Typography>
            </AccordionSummary>
            <AccordionDetails>{renderTable(filteredUsers.inactive?.operadores || [])}</AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={"bold"} fontSize={"1.3rem"}>
                Administradores
              </Typography>
            </AccordionSummary>
            <AccordionDetails>{renderTable(filteredUsers.inactive?.administradores || [])}</AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>

      {editUser && (
        <UserEditDialog EditDialog open={!!editUser} onClose={() => setEditUser(null)} user={editUser} onSave={handleSave} estados={estados} />
      )}
    </Box>
  );
};

export default ListUsersPage;
