import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

const CartStepTwo = ({ onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
            {...register("fullName", { required: "Este campo es requerido" })}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />

          <TextField
            label="Correo electrónico"
            fullWidth
            type="email"
            {...register("email", {
              required: "Este campo es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico inválido",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Teléfono"
            fullWidth
            {...register("phone", {
              required: "Este campo es requerido",
              pattern: {
                value: /^[0-9]{8}$/,
                message: "Número de teléfono inválido",
              },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <TextField label="NIT" fullWidth {...register("nit")} />

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
