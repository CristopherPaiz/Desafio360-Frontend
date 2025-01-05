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

export const schemaAddClient = yup.object().shape({
  razon_social: yup.string().required("La razón social es requerida").min(3, "La razón social debe tener al menos 3 caracteres"),
  nombre_comercial: yup.string().required("El nombre comercial es requerido").min(3, "El nombre comercial debe tener al menos 3 caracteres"),
  direccion_entrega: yup.string().required("La dirección de entrega es requerida").min(5, "La dirección debe tener al menos 5 caracteres"),
  telefono: yup
    .string()
    .required("El teléfono es requerido")
    .matches(/^[0-9]+$/, "El teléfono debe contener solo números")
    .min(8, "El teléfono debe tener al menos 8 dígitos"),
  email: yup.string().required("El email es requerido").email("Ingrese un email válido"),
});

// Función para calcular la fecha mínima (18 años atrás desde hoy)
const getMinDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
};

export const schemaAddUser = yup.object().shape({
  rol_idrol: yup.number().required("El rol es requerido"),
  correo_electronico: yup.string().required("El correo electrónico es requerido").email("Ingrese un correo electrónico válido"),
  nombre_completo: yup.string().required("El nombre completo es requerido").min(3, "El nombre debe tener al menos 3 caracteres"),
  password: yup.string().required("La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: yup
    .string()
    .required("Confirme la contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
  telefono: yup
    .number()
    .required("El teléfono es requerido")
    .typeError("El teléfono debe ser un número")
    .min(10000000, "El teléfono debe tener 8 dígitos")
    .max(99999999, "El teléfono debe tener 8 dígitos"),
  fecha_nacimiento: yup
    .date()
    .required("La fecha de nacimiento es requerida")
    .max(getMinDate(), "Debe ser mayor de 18 años")
    .typeError("Ingrese una fecha válida"),
});

export const schemaProductEdit = yup.object().shape({
  CategoriaProductos_idCategoriaProductos: yup.number().required("La categoría es requerida"),
  usuarios_idusuarios: yup.number().required("El usuario es requerido"),
  nombre: yup.string().required("El nombre es requerido"),
  marca: yup.string().required("La marca es requerida"),
  codigo: yup.string().required("El código es requerido"),
  stock: yup.number().required("El stock es requerido").min(0, "El stock debe ser positivo"),
  precio: yup.number().required("El precio es requerido").min(0, "El precio debe ser positivo"),
  imagen: yup.mixed(),
});

export const schemaAddProduct = yup.object().shape({
  nombre: yup.string().required("El nombre es requerido"),
  marca: yup.string().required("La marca es requerida"),
  codigo: yup.string().required("El código es requerido"),
  stock: yup.number().required("El stock es requerido").min(0, "El stock debe ser mayor o igual a 0"),
  precio: yup.number().required("El precio es requerido").min(0, "El precio debe ser mayor a 0"),
  CategoriaProductos_idCategoriaProductos: yup.number().required("La categoría es requerida"),
  imagen: yup.mixed().required("La imagen es requerida"),
});