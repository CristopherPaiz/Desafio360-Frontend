import { useState } from "react";
import { Box } from "@mui/material";
import CartStepper from "../components/cart/CartStepper";
import CartStepOne from "../components/cart/CartStepOne";
import CartStepTwo from "../components/cart/CartStepTwo";
import CartStepThree from "../components/cart/CartStepThree";
import useFetch from "../hooks/useFetch";
import { URL_BASE } from "../config/config";
import { useNotification } from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    stepOne: null,
    stepTwo: null,
  });
  const { request } = useFetch();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleNext = (data) => {
    if (activeStep === 0) {
      // Guardar los datos del paso 1
      setFormData((prev) => ({
        ...prev,
        stepOne: data,
      }));
    } else if (activeStep === 1) {
      // Guardar los datos del paso 2
      setFormData((prev) => ({
        ...prev,
        stepTwo: data,
      }));
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    // Calcular el total de la orden basado en los detalles
    const total_orden = formData.stepOne.detalles.reduce((total, item) => {
      return total + item.precio * item.cantidad;
    }, 0);

    // Extraer la información relevante del cliente
    const clientInfo = formData.stepTwo.clientDetails;

    // Objeto Final
    const finalData = {
      usuarios_idusuarios: formData.stepTwo.selectedClient,
      estados_idestados: 4,
      nombre_completo: formData.stepTwo.nombre_completo,
      direccion: clientInfo.direccion_entrega,
      telefono: formData.stepTwo.telefono,
      correo_electronico: formData.stepTwo.correo_electronico,
      fecha_entrega: formData.stepTwo.fecha_entrega || new Date().toISOString().split("T")[0],
      total_orden: total_orden,
      detalles: formData.stepOne.detalles,
    };

    console.log("Orden Completa!", finalData);
    const response = await request(`${URL_BASE}/ordenes`, "POST", finalData);

    if (response.error) {
      showNotification({ message: "Error al finalizar la compra", severity: "error" });
      console.error("Error al crear la orden:", response.error);
      return;
    } else {
      showNotification({ message: "Orden creada con éxito", severity: "success" });
      clearCart();
      navigate("/");
      console.log("Orden creada con éxito");
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <CartStepOne onNext={handleNext} />;
      case 1:
        return <CartStepTwo onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <CartStepThree onBack={handleBack} onComplete={handleComplete} stepOneData={formData.stepOne} stepTwoData={formData.stepTwo} />;
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
