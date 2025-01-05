import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetch from "../../hooks/useFetch";
import { useNotification } from "../../hooks/useNotification";
import { URL_BASE } from "../../config/config";
import { Box, Paper, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { Category as CategoryIcon, Save as SaveIcon } from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import { schemaAddCategory } from "../../Validations/validationsSchema";

const AddCategoryPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const { request } = useFetch();
  const { showNotification } = useNotification();
  const { userData } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaAddCategory),
    defaultValues: {
      nombre: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const categoryData = {
        usuarios_idusuarios: userData.idusuarios,
        nombre: data.nombre,
        estados_idestados: 1,
      };

      const response = await request(`${URL_BASE}/categorias`, "POST", categoryData);

      if (response.error) {
        showNotification({
          message: response.error || "Error al registrar la categoría",
          severity: "error",
        });
      } else {
        showNotification({
          message: "Categoría registrada exitosamente",
          severity: "success",
        });
        reset();
      }
    } catch (error) {
      console.error(error);
      showNotification({
        message: "Error al registrar la categoría",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <CategoryIcon fontSize="large" />
          Registrar Nueva Categoría
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <CategoryIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                fullWidth
                label="Nombre de la Categoría"
                variant="outlined"
                {...register("nombre")}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => reset()} disabled={submitting}>
                Limpiar
              </Button>
              <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />} disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Categoría"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddCategoryPage;
