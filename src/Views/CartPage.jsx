import { useState } from "react";
import { Box } from "@mui/material";
import CartStepper from "../components/cart/CartStepper";
import CartStepOne from "../components/cart/CartStepOne";
import CartStepTwo from "../components/cart/CartStepTwo";
import CartStepThree from "../components/cart/CartStepThree";

const CartPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    console.log("Orden Completa!");
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <CartStepOne onNext={handleNext} />;
      case 1:
        return <CartStepTwo onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <CartStepThree onBack={handleBack} onComplete={handleComplete} />;
      default:
        return <CartStepOne onNext={handleNext} />;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <CartStepper activeStep={activeStep} />
      {renderStep()}
    </Box>
  );
};

export default CartPage;
