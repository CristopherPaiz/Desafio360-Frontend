import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetch from "../../hooks/useFetch";
import { useNotification } from "../../hooks/useNotification";
import { URL_BASE } from "../../config/config";
import { Box, Paper, Typography, TextField, Button, CircularProgress } from "@mui/material";
import {
  Business as BusinessIcon,
  StoreMallDirectory as StoreIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { schemaAddClient } from "../../Validations/validationsSchema";

const AddClientsPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const { request } = useFetch();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaAddClient),
    defaultValues: {
      razon_social: "",
      nombre_comercial: "",
      direccion_entrega: "",
      telefono: "",
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await request(`${URL_BASE}/clientes`, "POST", data);

      if (response.error) {
        showNotification({
          message: response.error || "Error al registrar el cliente",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Cliente registrado exitosamente",
          severity: "success",
        });
        reset();
      }
    } catch (error) {
      console.error(error);
      showNotification({
        message: "Error al registrar el cliente",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <BusinessIcon fontSize="large" />
          Registrar Nuevo Cliente
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <BusinessIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Razón Social"
                  variant="outlined"
                  {...register("razon_social")}
                  error={!!errors.razon_social}
                  helperText={errors.razon_social?.message}
                />
              </Box>
            </Box>

            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <StoreIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Nombre Comercial"
                  variant="outlined"
                  {...register("nombre_comercial")}
                  error={!!errors.nombre_comercial}
                  helperText={errors.nombre_comercial?.message}
                />
              </Box>
            </Box>

            <Box sx={{ flex: "1 1 100%" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <LocationIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Dirección de Entrega"
                  variant="outlined"
                  {...register("direccion_entrega")}
                  error={!!errors.direccion_entrega}
                  helperText={errors.direccion_entrega?.message}
                />
              </Box>
            </Box>

            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <PhoneIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Teléfono"
                  variant="outlined"
                  {...register("telefono")}
                  error={!!errors.telefono}
                  helperText={errors.telefono?.message}
                />
              </Box>
            </Box>

            <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <MailIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Box>
            </Box>

            <Box sx={{ flex: "1 1 100%", display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => reset()} disabled={submitting}>
                Limpiar
              </Button>
              <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />} disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Cliente"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddClientsPage;
