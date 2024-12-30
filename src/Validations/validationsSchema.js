import * as yup from "yup";

// Esquema para el login
export const loginSchema = yup.object().shape({
  correo: yup.string().email("Ingrese un correo válido").required("El correo es requerido"),
  contrasenia: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
});

// Esquema para el formulario de CartStepTwo
export const CartStepTwoSchema = yup.object().shape({
  nombre_completo: yup.string().required("El nombre es requerido"),
  correo_electronico: yup.string().email("Ingrese un correo válido").required("El correo es requerido"),
  telefono: yup
    .string()
    .matches(/^[0-9]{8}$/, "El teléfono debe tener 8 dígitos")
    .required("El teléfono es requerido"),
  cliente: yup.string().required("El cliente es requerido"),
});
