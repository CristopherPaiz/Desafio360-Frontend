import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetch from "../../hooks/useFetch";
import { useNotification } from "../../hooks/useNotification";
import { URL_BASE } from "../../config/config";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  QrCode as QrCodeIcon,
  Warehouse as WarehouseIcon,
  AttachMoney as MoneyIcon,
  Save as SaveIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { schemaAddProduct } from "../../Validations/validationsSchema";
import { useAuth } from "../../context/AuthContext";

const AddProductPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const { request } = useFetch();
  const { userData } = useAuth();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schemaAddProduct),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await request(`${URL_BASE}/categorias`, "GET");
        if (response) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showNotification({
          message: "Error al cargar las categorías",
          severity: "error",
        });
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue("imagen", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const formData = new FormData();

    formData.append("imagen", data.imagen);
    formData.append("CategoriaProductos_idCategoriaProductos", data.CategoriaProductos_idCategoriaProductos);
    formData.append("usuarios_idusuarios", userData.idusuarios);
    formData.append("nombre", data.nombre);
    formData.append("marca", data.marca);
    formData.append("codigo", data.codigo);
    formData.append("stock", data.stock);
    formData.append("estados_idestados", 1);
    formData.append("precio", data.precio);

    try {
      const response = await request(`${URL_BASE}/productos/img`, "POST", formData, { img: true });

      if (response.error) {
        showNotification({
          message: response.error || "Error al registrar el producto",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Producto registrado exitosamente",
          severity: "success",
        });
        reset();
        setImagePreview(null);
      }
    } catch (error) {
      console.error(error);
      showNotification({
        message: "Error al registrar el producto",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!categories.length) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <InventoryIcon fontSize="large" />
          Registrar Nuevo Producto
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {/* Imagen */}
            <Box sx={{ flex: "1 1 100%" }}>
              <input accept="image/*" style={{ display: "none" }} id="image-upload" type="file" onChange={handleImageChange} />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" startIcon={<ImageIcon />} sx={{ mb: 2 }}>
                  Subir Imagen
                </Button>
              </label>
              {errors.imagen && <FormHelperText error>{errors.imagen.message}</FormHelperText>}
              {imagePreview && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                </Box>
              )}
            </Box>

            {/* Categoria */}
            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <FormControl fullWidth error={!!errors.CategoriaProductos_idCategoriaProductos}>
                <InputLabel>Categoría</InputLabel>
                <Select {...register("CategoriaProductos_idCategoriaProductos")} label="Categoría" startAdornment={<CategoryIcon sx={{ mr: 1 }} />}>
                  {categories.map((category) => (
                    <MenuItem key={category.idCategoriaProductos} value={category.idCategoriaProductos}>
                      {category.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.CategoriaProductos_idCategoriaProductos && (
                  <FormHelperText>{errors.CategoriaProductos_idCategoriaProductos.message}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Nombre */}
            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <LabelIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  {...register("nombre")}
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />
              </Box>
            </Box>

            {/* Marca */}
            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <LabelIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField fullWidth label="Marca" {...register("marca")} error={!!errors.marca} helperText={errors.marca?.message} />
              </Box>
            </Box>

            {/* Codigo */}
            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <QrCodeIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField fullWidth label="Código" {...register("codigo")} error={!!errors.codigo} helperText={errors.codigo?.message} />
              </Box>
            </Box>

            {/* Stock */}
            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <WarehouseIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Stock Inicial"
                  type="number"
                  {...register("stock")}
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              </Box>
            </Box>

            {/* Precio */}
            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <MoneyIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Precio (GTQ)"
                  type="text"
                  {...register("precio")}
                  error={!!errors.precio}
                  helperText={errors.precio?.message}
                />
              </Box>
            </Box>

            {/* Botones */}
            <Box sx={{ flex: "1 1 100%", display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  reset();
                  setImagePreview(null);
                }}
                disabled={submitting}
              >
                Limpiar
              </Button>
              <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />} disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Producto"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProductPage;
