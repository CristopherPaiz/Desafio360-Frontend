import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";
import { schemaUserEdit } from "../../Validations/validationsSchema";

const ADMIN_ID = 1;
const OPERADOR_ID = 2;
const CLIENTE_ID = 3;

const roles = [
  { id: ADMIN_ID, name: "Administrador" },
  { id: OPERADOR_ID, name: "Operador" },
  { id: CLIENTE_ID, name: "Cliente" },
];

const UserEditDialog = ({ open, onClose, user, onSave, estados }) => {
  // Filtra los estados para que solo se muestren los estados "Activo" e "Inactivo"
  const filteredEstados = estados.filter((estado) => ["Activo", "Inactivo"].includes(estado.nombre));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaUserEdit),
    defaultValues: {
      rol_idrol: roles.find((role) => role.name === user?.rol)?.id || "",
      estados_idestados: filteredEstados.find((estado) => estado.nombre === user?.estado)?.idestados || "",
      correo_electronico: user?.correo_electronico || "",
      nombre_completo: user?.nombre_completo || "",
      telefono: user?.telefono || "",
      fecha_nacimiento: user?.fecha_nacimiento || "",
    },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={"bold"}>Editar Usuario</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
            <TextField
              label="Nombre Completo"
              {...register("nombre_completo")}
              error={!!errors.nombre_completo}
              helperText={errors.nombre_completo?.message}
              fullWidth
            />

            <TextField
              label="Correo Electrónico"
              {...register("correo_electronico")}
              error={!!errors.correo_electronico}
              helperText={errors.correo_electronico?.message}
              fullWidth
            />

            {/* Rol y Estado */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                select
                defaultValue={Number(roles.find((role) => role.name === user?.rol)?.id)}
                label="Rol"
                {...register("rol_idrol")}
                error={!!errors.rol_idrol}
                helperText={errors.rol_idrol?.message}
                fullWidth
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                defaultValue={filteredEstados.find((estado) => estado.nombre === user?.estado)?.idestados}
                label="Estado"
                {...register("estados_idestados")}
                error={!!errors.estados_idestados}
                helperText={errors.estados_idestados?.message}
                fullWidth
              >
                {filteredEstados.map((estado) => (
                  <MenuItem key={estado.idestados} value={estado.idestados}>
                    {estado.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Teléfono y Fecha de Nacimiento */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                {...register("fecha_nacimiento")}
                error={!!errors.fecha_nacimiento}
                helperText={errors.fecha_nacimiento?.message}
                fullWidth
              />

              <TextField
                label="Teléfono"
                type="number"
                {...register("telefono")}
                error={!!errors.telefono}
                helperText={errors.telefono?.message}
                fullWidth
              />
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

UserEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  estados: PropTypes.array,
};

export default UserEditDialog;
