import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";
import { CartStepTwoSchema } from "../../Validations/validationsSchema";
import PropTypes from "prop-types";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import { URL_BASE } from "../../config/config";
import { useNotification } from "../../hooks/useNotification";

const CartStepTwo = ({ onNext, onBack }) => {
  const { userData } = useAuth();
  const { request } = useFetch();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CartStepTwoSchema),
    defaultValues: {
      nombre_completo: userData.nombre_completo,
      correo_electronico: userData.correo_electronico,
      telefono: userData.telefono,
      cliente: userData.cliente,
      selectedClient: "",
    },
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await request(`${URL_BASE}/clientes/filtro?id=${userData.idusuarios}`, "GET", null);
        setClients(response.data);
      } catch (error) {
        showNotification({ message: "Error al consultar los clientes", severity: "error" });
        console.error("Error al consultar los clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [request, userData.idusuarios, showNotification]);

  const onSubmit = (data) => {
    if (!data.selectedClient) {
      showNotification({ message: "Debes seleccionar un cliente", severity: "error" });
      return;
    }
    const selectedClientData = clients.find((client) => client.idClientes === data.selectedClient);
    const submissionData = {
      ...data,
      clientDetails: selectedClientData,
    };
    onNext(submissionData);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Verifica tus datos
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nombre completo"
            fullWidth
            {...register("nombre_completo")}
            error={!!errors.nombre_completo}
            helperText={errors.nombre_completo?.message}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Correo electrónico"
            fullWidth
            type="email"
            {...register("correo_electronico")}
            error={!!errors.correo_electronico}
            helperText={errors.correo_electronico?.message}
          />
          <TextField label="Teléfono" fullWidth {...register("telefono")} error={!!errors.telefono} helperText={errors.telefono?.message} />

          <FormControl fullWidth error={!!errors.selectedClient}>
            <InputLabel id="client-select-label">Seleccionar Cliente</InputLabel>
            <Controller
              name="selectedClient"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select labelId="client-select-label" label="Seleccionar Cliente" {...field} disabled={loading || clients?.length === 0}>
                  {clients?.length > 0 ? (
                    clients?.map((client) => (
                      <MenuItem key={client.idClientes} value={client.idClientes}>
                        {client.razon_social} - {client.nombre_comercial}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No hay clientes disponibles</MenuItem>
                  )}
                </Select>
              )}
            />
            {errors.selectedClient && <FormHelperText>{errors.selectedClient.message}</FormHelperText>}
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={onBack}>Regresar</Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Continuar
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

CartStepTwo.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default CartStepTwo;
