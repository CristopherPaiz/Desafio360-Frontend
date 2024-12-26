import * as yup from "yup";

export const loginSchema = yup.object().shape({
  usuario: yup.string().email("Ingrese un correo válido").required("El correo es requerido"),
  contrasenia: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
});
