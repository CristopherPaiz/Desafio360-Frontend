import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";
import { schemaClientEdit } from "../../Validations/validationsSchema";

const ClientEditDialog = ({ open, onClose, client, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaClientEdit),
    defaultValues: {
      razon_social: client?.razon_social || "",
      nombre_comercial: client?.nombre_comercial || "",
      direccion_entrega: client?.direccion_entrega || "",
      telefono: client?.telefono || "",
      email: client?.email || "",
    },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={"bold"}>Editar Cliente</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
            <TextField
              label="Razón Social"
              {...register("razon_social")}
              error={!!errors.razon_social}
              helperText={errors.razon_social?.message}
              fullWidth
            />

            <TextField
              label="Nombre Comercial"
              {...register("nombre_comercial")}
              error={!!errors.nombre_comercial}
              helperText={errors.nombre_comercial?.message}
              fullWidth
            />

            <TextField
              label="Dirección de Entrega"
              {...register("direccion_entrega")}
              error={!!errors.direccion_entrega}
              helperText={errors.direccion_entrega?.message}
              fullWidth
              multiline
              rows={2}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="Teléfono" {...register("telefono")} error={!!errors.telefono} helperText={errors.telefono?.message} fullWidth />

              <TextField label="Correo Electrónico" {...register("email")} error={!!errors.email} helperText={errors.email?.message} fullWidth />
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

ClientEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  client: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ClientEditDialog;
