import * as yup from "yup";
import { subYears } from "date-fns";

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
    .required("El teléfono es requerido")
    .min(8, "El teléfono debe tener 8 dígitos")
    .max(8, "El teléfono debe tener 8 dígitos"),
  cliente: yup.string().required("El cliente es requerido"),
});

// Esquema para el formulario de UserEditDialog
export const schemaUserEdit = yup.object().shape({
  rol_idrol: yup.number().required("El rol es requerido"),
  estados_idestados: yup.number().required("El estado es requerido"),
  correo_electronico: yup.string().email("Correo electrónico inválido").required("El correo es requerido"),
  nombre_completo: yup.string().required("El nombre es requerido"),
  telefono: yup
    .string()
    .matches(/^[0-9]{8}$/, "El teléfono debe tener 8 dígitos")
    .required("El teléfono es requerido")
    .min(8, "El teléfono debe tener 8 dígitos")
    .max(8, "El teléfono debe tener 8 dígitos"),
  fecha_nacimiento: yup.date().max(subYears(new Date(), 18), "Debe ser mayor de 18 años").required("La fecha de nacimiento es requerida"),
});

export const schemaClientEdit = yup.object().shape({
  razon_social: yup.string().required("La razón social es requerida"),
  nombre_comercial: yup.string().required("El nombre comercial es requerido"),
  direccion_entrega: yup.string().required("La dirección de entrega es requerida"),
  telefono: yup
    .string()
    .required("El teléfono es requerido")
    .matches(/^[0-9]+$/, "El teléfono solo debe contener números")
    .min(8, "El teléfono debe tener al menos 8 dígitos"),
  email: yup.string().email("Correo electrónico inválido").required("El correo electrónico es requerido"),
});
