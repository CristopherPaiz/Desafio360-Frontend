import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";
import { CartStepTwoSchema } from "../../Validations/validationsSchema";
import PropTypes from "prop-types";

const CartStepTwo = ({ onNext, onBack }) => {
  const { userData } = useAuth();
  console.log(userData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CartStepTwoSchema),
    defaultValues: {
      nombre_completo: userData.nombre_completo,
      correo_electronico: userData.correo_electronico,
      telefono: userData.telefono,
      cliente: userData.cliente,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    onNext();
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

          <TextField
            label="Cliente"
            fullWidth
            {...register("cliente")}
            error={!!errors.cliente}
            helperText={errors.cliente?.message}
            InputProps={{
              readOnly: true,
            }}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={onBack}>Regresar</Button>
            <Button type="submit" variant="contained" color="primary">
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
