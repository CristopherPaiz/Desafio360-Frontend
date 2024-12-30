import { Box, Stepper, Step, StepLabel } from "@mui/material";
import PropTypes from "prop-types";

const CartStepper = ({ activeStep }) => {
  const steps = ["Verifica tu carrito", "Verifica tus datos", "Datos de envío y pago"];

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

CartStepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
};

export default CartStepper;
