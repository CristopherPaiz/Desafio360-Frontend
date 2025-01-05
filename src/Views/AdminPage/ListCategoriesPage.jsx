import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNotification } from "../../hooks/useNotification";
import { URL_BASE } from "../../config/config";
import CategoryEditDialog from "./CategoryEditDialog";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  CheckCircle as StatusIcon,
  CalendarToday as DateIcon,
  Grid3x3 as GridID,
} from "@mui/icons-material";

const ListCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { request } = useFetch();
  const { showNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await request(`${URL_BASE}/categorias`, "GET", null);

      if (response.error) {
        showNotification({
          message: "Error al cargar los datos",
          severity: "error",
        });
      } else {
        setCategories(response.data);
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
    const filterCategories = () => {
      const filtered = categories.filter((category) => category.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredCategories(filtered);
    };
    filterCategories();
  }, [categories, searchTerm]);

  const handleEdit = (category) => {
    setEditCategory(category);
  };

  const handleSave = async (updatedData) => {
    try {
      console.log(updatedData);
      const response = await request(`${URL_BASE}/categorias/${editCategory.idCategoriaProductos}`, "PUT", updatedData);

      if (response.error) {
        showNotification({
          message: response.error || "Error al actualizar la categoría",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Categoría actualizada exitosamente",
          severity: "success",
        });
        setEditCategory(null);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      showNotification({
        message: "Error al actualizar la categoría",
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
        Listado de Categorías
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Buscar por nombre de categoría"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <GridID style={{ marginRight: "8px" }} /> ID
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CategoryIcon style={{ marginRight: "8px" }} /> Nombre
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon style={{ marginRight: "8px" }} /> Usuario
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StatusIcon style={{ marginRight: "8px" }} /> Estado
                </div>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <DateIcon style={{ marginRight: "8px" }} /> Fecha Creación
                </div>
              </TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.idCategoriaProductos}>
                <TableCell>{category.idCategoriaProductos}</TableCell>
                <TableCell>{category.nombre}</TableCell>
                <TableCell>{category.usuario}</TableCell>
                <TableCell>{category.estado}</TableCell>
                <TableCell>{new Date(category.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Box>
                    <IconButton onClick={() => handleEdit(category)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editCategory && <CategoryEditDialog open={!!editCategory} onClose={() => setEditCategory(null)} category={editCategory} onSave={handleSave} />}
    </Box>
  );
};

export default ListCategoriesPage;
