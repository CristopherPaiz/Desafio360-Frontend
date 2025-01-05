import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Select, MenuItem, FormHelperText } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";
import { schemaEditCategory } from "../../Validations/validationsSchema";
import { useAuth } from "../../context/AuthContext";

const CategoryEditDialog = ({ open, onClose, category, onSave }) => {
  const { userData } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaEditCategory),
    defaultValues: {
      nombre: category?.nombre || "",
      usuarios_idusuarios: userData.idusuarios || "",
      estados_idestados: category?.estado || 1, // Garantiza que no sea undefined
    },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={"bold"}>Editar Categoría</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
            <TextField label="Nombre" {...register("nombre")} error={!!errors.nombre} helperText={errors.nombre?.message} fullWidth />

            <Box>
              <Select label="Estado" {...register("estados_idestados")} error={!!errors.estados_idestados} fullWidth>
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={2}>Inactivo</MenuItem>
              </Select>
              {errors.estados_idestados && <FormHelperText error>{errors.estados_idestados.message}</FormHelperText>}
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

CategoryEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  category: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default CategoryEditDialog;
