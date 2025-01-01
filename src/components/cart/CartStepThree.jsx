import { Box, Typography, Button, FormControl, RadioGroup, FormControlLabel, Radio, Divider, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

const CartStepThree = ({ onBack, onComplete, stepTwoData }) => {
  const { handleSubmit } = useForm();

  const onSubmit = (data) => {
    const finalData = {
      paymentMethod: data.paymentMethod,
      clientData: stepTwoData,
    };
    onComplete(finalData);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Confirmación de orden y pago
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Datos del Cliente
            </Typography>
            <Box sx={{ display: "grid", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Razón Social
                </Typography>
                <Typography>{stepTwoData?.clientDetails?.razon_social}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Nombre Comercial
                </Typography>
                <Typography>{stepTwoData?.clientDetails?.nombre_comercial}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Dirección de Entrega
                </Typography>
                <Typography>{stepTwoData?.clientDetails?.direccion_entrega}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography>{stepTwoData?.telefono}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{stepTwoData?.clientDetails?.email}</Typography>
              </Box>
            </Box>
          </Paper>

          <Divider />

          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Método de pago
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup defaultValue="creditCard" name="paymentMethod">
                <FormControlLabel value="creditCard" control={<Radio />} label="Tarjeta de crédito/débito" />
                <FormControlLabel value="cash" control={<Radio />} label="Pago contra entrega" />
              </RadioGroup>
            </FormControl>
          </Paper>

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
  stepTwoData: PropTypes.object.isRequired,
};

export default CartStepThree;
