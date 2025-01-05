import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetch from "../../hooks/useFetch";
import { useNotification } from "../../hooks/useNotification";
import { URL_BASE } from "../../config/config";
import { Box, Paper, Typography, TextField, Button, CircularProgress, MenuItem } from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  CalendarMonth as CalendarIcon,
  Badge as BadgeIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { schemaAddUser } from "../../Validations/validationsSchema";

const ADMIN_ID = 1;
const OPERADOR_ID = 2;
const CLIENTE_ID = 3;

const roles = [
  { id: ADMIN_ID, name: "Administrador" },
  { id: OPERADOR_ID, name: "Operador" },
  { id: CLIENTE_ID, name: "Cliente" },
];

const AddUsersPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const { request } = useFetch();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaAddUser),
    defaultValues: {
      rol_idrol: "",
      estados_idestados: 1,
      correo_electronico: "",
      nombre_completo: "",
      password: "",
      confirmPassword: "",
      telefono: "",
      fecha_nacimiento: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    console.log("fehca", data.fecha_nacimiento);
    try {
      const submitData = {
        rol_idrol: parseInt(data.rol_idrol),
        estados_idestados: 1,
        correo_electronico: data.correo_electronico,
        nombre_completo: data.nombre_completo,
        password: data.password,
        telefono: parseInt(data.telefono),
        fecha_nacimiento: data.fecha_nacimiento,
      };

      const response = await request(`${URL_BASE}/usuarios`, "POST", submitData);

      if (response.error) {
        showNotification({
          message: response.error || "Error al registrar el usuario",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Usuario registrado exitosamente",
          severity: "success",
        });
        reset();
      }
    } catch (error) {
      console.error(error);
      showNotification({
        message: "Error al registrar el usuario",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          p: 4,
          minWidth: "1000px",
          maxWidth: "1200px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <PersonIcon />
          Registrar Nuevo Usuario
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Primera fila */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                "& > *": { flex: 1 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BadgeIcon sx={{ mr: 1, my: 0.5 }} />
                <TextField select fullWidth label="Rol" {...register("rol_idrol")} error={!!errors.rol_idrol} helperText={errors.rol_idrol?.message}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon sx={{ mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  {...register("correo_electronico")}
                  error={!!errors.correo_electronico}
                  helperText={errors.correo_electronico?.message}
                />
              </Box>
            </Box>

            {/* Segunda fila */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                "& > *": { flex: 1 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  {...register("nombre_completo")}
                  error={!!errors.nombre_completo}
                  helperText={errors.nombre_completo?.message}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon sx={{ mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Teléfono"
                  type="number"
                  {...register("telefono")}
                  error={!!errors.telefono}
                  helperText={errors.telefono?.message}
                />
              </Box>
            </Box>

            {/* Tercera fila */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                "& > *": { flex: 1 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LockIcon sx={{ mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LockIcon sx={{ mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  type="password"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Box>
            </Box>

            {/* Cuarta fila */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                "& > *": { flex: 1 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarIcon sx={{ mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("fecha_nacimiento")}
                  error={!!errors.fecha_nacimiento}
                  helperText={errors.fecha_nacimiento?.message}
                />
              </Box>
              <Box></Box> {/* Espacio en blanco xD */}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: -8,
              }}
            >
              <Button variant="outlined" onClick={() => reset()} disabled={submitting}>
                Limpiar
              </Button>
              <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />} disabled={submitting}>
                {submitting ? "Guardando..." : "Registrar Usuario"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddUsersPage;
