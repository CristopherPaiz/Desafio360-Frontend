import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box, Input, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";
import { schemaProductEdit } from "../../Validations/validationsSchema";

const ProductEditDialog = ({ open, onClose, product, onSave, categorias }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schemaProductEdit),
    defaultValues: {
      CategoriaProductos_idCategoriaProductos: categorias.find((cat) => cat.nombre === product?.categoria)?.idCategoriaProductos || "",
      usuarios_idusuarios: 1, // Asumiendo un ID de usuario fijo para este ejemplo
      nombre: product?.nombre || "",
      marca: product?.marca || "",
      codigo: product?.codigo || "",
      stock: product?.stock || "",
      precio: product?.precio || "",
    },
  });

  const selectedFile = watch("imagen");
  const [previewImage, setPreviewImage] = useState(product?.foto || ""); // Estado para la vista previa

  const handleImageChange = () => {
    if (selectedFile && selectedFile[0]) {
      const file = selectedFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(product?.foto || ""); // Restablecer a la imagen original
    }
  };

  const onSubmit = (data) => {
    const formData = { ...data };
    if (selectedFile && selectedFile[0]) {
      formData.imagen = selectedFile[0]; // Adjuntar archivo si existe
    }
    onSave(formData);
  };

  React.useEffect(() => {
    handleImageChange(); // Escuchar cambios en la selección del archivo
  }, [selectedFile]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={"bold"}>Editar Producto</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
            <TextField label="Nombre" {...register("nombre")} error={!!errors.nombre} helperText={errors.nombre?.message} fullWidth />

            <TextField label="Marca" {...register("marca")} error={!!errors.marca} helperText={errors.marca?.message} fullWidth />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="Código" {...register("codigo")} error={!!errors.codigo} helperText={errors.codigo?.message} fullWidth />

              <TextField
                select
                label="Categoría"
                {...register("CategoriaProductos_idCategoriaProductos")}
                error={!!errors.CategoriaProductos_idCategoriaProductos}
                helperText={errors.CategoriaProductos_idCategoriaProductos?.message}
                fullWidth
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.idCategoriaProductos} value={categoria.idCategoriaProductos}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="Stock" type="number" {...register("stock")} error={!!errors.stock} helperText={errors.stock?.message} fullWidth />

              <TextField label="Precio" type="text" {...register("precio")} error={!!errors.precio} helperText={errors.precio?.message} fullWidth />
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Imagen actual o seleccionada:
              </Typography>
              {previewImage && (
                <img src={previewImage} alt={product?.nombre} style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "1rem" }} />
              )}

              <Input type="file" {...register("imagen")} error={!!errors.imagen} fullWidth accept="image/*" />
              {errors.imagen && (
                <Typography color="error" variant="caption">
                  {errors.imagen.message}
                </Typography>
              )}
              {selectedFile && selectedFile[0] && (
                <Typography variant="caption" display="block">
                  Archivo seleccionado: {selectedFile[0].name}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 4, pr: 4 }}>
          <Button onClick={onClose} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ProductEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  categorias: PropTypes.array,
};

export default ProductEditDialog;
