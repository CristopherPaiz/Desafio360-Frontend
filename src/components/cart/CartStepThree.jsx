import { Box, Typography, TextField, Button, FormControl, RadioGroup, FormControlLabel, Radio, Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

const CartStepThree = ({ onBack, onComplete }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    onComplete();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Datos de envío y pago
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Shipping Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Dirección de envío
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Dirección"
                fullWidth
                multiline
                rows={2}
                {...register("address", { required: "La dirección es requerida" })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Departamento"
                  fullWidth
                  {...register("state", { required: "El departamento es requerido" })}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />

                <TextField
                  label="Ciudad"
                  fullWidth
                  {...register("city", { required: "La ciudad es requerida" })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />

                <TextField
                  label="Código Postal"
                  fullWidth
                  {...register("zipCode", { required: "El código postal es requerido" })}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Payment Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Método de pago
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup defaultValue="creditCard">
                <FormControlLabel value="creditCard" control={<Radio />} label="Tarjeta de crédito/débito" />
                <FormControlLabel value="cash" control={<Radio />} label="Pago contra entrega" />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={onBack}>Regresar</Button>
            <Button type="submit" variant="contained" color="primary">
              Completar compra
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

CartStepThree.propTypes = {
  onBack: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default CartStepThree;
