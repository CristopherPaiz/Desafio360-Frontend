import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNotification } from "../../hooks/useNotification";
import { URL_BASE } from "../../config/config";
import ProductEditDialog from "./ProductEditDialog";
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
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  ExpandMore as ExpandMoreIcon,
  DisabledByDefault,
  Label as BrandIcon,
} from "@mui/icons-material";

const ListProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("nombre");

  const { request } = useFetch();
  const { showNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsResponse, categoriasResponse] = await Promise.all([
        request(`${URL_BASE}/productos`, "GET", null),
        request(`${URL_BASE}/categorias`, "GET", null),
      ]);

      if (productsResponse.error || categoriasResponse.error) {
        showNotification({
          message: "Error al cargar los datos",
          severity: "error",
        });
      } else {
        setProducts(productsResponse.data);
        setCategorias(categoriasResponse.data);
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
    const filterProducts = () => {
      const activeProducts = products.filter((product) => product.estado === "Activo");
      const inactiveProducts = products.filter((product) => product.estado === "Inactivo");

      const filterByCategory = (products, categoria) => {
        return products
          .filter((product) => product.categoria === categoria)
          .filter((product) => product[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      };

      const uniqueCategories = [...new Set(products.map((product) => product.categoria))];

      const filtered = {
        active: {},
        inactive: {},
      };

      uniqueCategories.forEach((categoria) => {
        filtered.active[categoria] = filterByCategory(activeProducts, categoria);
        filtered.inactive[categoria] = filterByCategory(inactiveProducts, categoria);
      });

      setFilteredProducts(filtered);
    };
    filterProducts();
  }, [products, searchTerm, searchField]);

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleSave = async (updatedData) => {
    try {
      let body = updatedData;

      // Verificar si contiene archivo para usar FormData
      if (updatedData.imagen instanceof File) {
        const formData = new FormData();
        Object.keys(updatedData).forEach((key) => {
          formData.append(key, updatedData[key]);
        });
        body = formData;
      }

      const response = await request(`${URL_BASE}/productos/${editProduct.idProductos}`, "PUT", body, { img: true });

      if (response.error) {
        showNotification({
          message: response.error || "Error al actualizar el producto",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Producto actualizado exitosamente",
          severity: "success",
        });
        setEditProduct(null);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      showNotification({
        message: "Error al actualizar el producto",
        severity: "error",
      });
    }
  };

  const renderTable = (products) => (
    <TableContainer>
      <Table sx={{ minWidth: 950 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <GridID />
            </TableCell>
            <TableCell>
              <InventoryIcon /> Nombre
            </TableCell>
            <TableCell>
              <BrandIcon /> Marca
            </TableCell>
            <TableCell>
              <PriceIcon /> Precio
            </TableCell>
            <TableCell>
              <CategoryIcon /> Stock
            </TableCell>
            <TableCell>Imagen</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.idProductos}>
              <TableCell>{product.idProductos}</TableCell>
              <TableCell>{product.nombre}</TableCell>
              <TableCell>{product.marca}</TableCell>
              <TableCell>${product.precio.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <img src={product.foto} alt={product.nombre} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleEdit(product)} color="primary">
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
        Listado de Productos
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField label="Buscar" variant="outlined" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Box>
          <FormControlLabel control={<Checkbox checked={searchField === "nombre"} onChange={() => setSearchField("nombre")} />} label="Nombre" />
          <FormControlLabel control={<Checkbox checked={searchField === "marca"} onChange={() => setSearchField("marca")} />} label="Marca" />
        </Box>
      </Box>

      {Object.keys(filteredProducts.active || {}).map((categoria) => (
        <Accordion key={categoria}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2}>
              <CategoryIcon />
              <Typography variant="h6">{categoria}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>{renderTable(filteredProducts.active[categoria] || [])}</AccordionDetails>
        </Accordion>
      ))}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={2}>
            <DisabledByDefault />
            <Typography variant="h6">Inactivos</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(filteredProducts.inactive || {}).map((categoria) => (
            <Accordion key={categoria}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={2}>
                  <CategoryIcon />
                  <Typography variant="h6">{categoria}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>{renderTable(filteredProducts.inactive[categoria] || [])}</AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>

      {editProduct && (
        <ProductEditDialog
          open={!!editProduct}
          onClose={() => setEditProduct(null)}
          product={editProduct}
          onSave={handleSave}
          categorias={categorias}
        />
      )}
    </Box>
  );
};

export default ListProductsPage;
