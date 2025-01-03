import { jwtDecode } from "jwt-decode";
import { yupResolver } from "@hookform/resolvers/yup";
import { Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { URL_BASE } from "../config/config";
// Componentes
import { loginSchema } from "../Validations/validationsSchema";
import CustomFormBox from "../components/ui/CustomFormBox";
import CustomTypography from "../components/ui/CustomTypography";
import CustomInput from "../components/ui/CustomInput";
import CustomButton from "../components/ui/CustomButton";
// HOOKS
import { useForm } from "react-hook-form";
import useFetch from "../hooks/useFetch";
import { useNotification } from "../hooks/useNotification";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { loading, request } = useFetch();
  const { showNotification } = useNotification();
  const { login, setUserData } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await request(`${URL_BASE}/auth/login`, "POST", data);
    if (result.error) {
      showNotification({
        message: result?.error,
        severity: "error",
      });
    } else {
      setUserData(result.data.data); // Guardamos los datos del usuario
      login(result.data.mensaje); // Guardamos el token JWT

      const token = localStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);

      if (decodedToken.rol === "Administrador" || decodedToken.rol === "Operador") {
        navigate("/ordenes");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <CustomFormBox>
      <Box
        component="img"
        src="/LogoMedium.webp"
        sx={{
          maxWidth: 300,
          mr: 4,
        }}
      />
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <CustomTypography variant="h4">Inicio de sesión</CustomTypography>

        <CustomInput
          label="Correo electrónico"
          type="email"
          placeholder="Ingrese su correo electrónico"
          startIcon={<Email />}
          register={register("correo")}
          defaultValue="admin1@admin1.com"
          error={!!errors.correo}
          helperText={errors.correo?.message}
        />

        <CustomInput
          label="Contraseña"
          type="password"
          placeholder="********"
          defaultValue="admin123"
          startIcon={<Lock />}
          register={register("contrasenia")}
          error={!!errors.contrasenia}
          helperText={errors.contrasenia?.message}
        />

        <CustomButton fullWidth loading={loading} type="submit" color="accent">
          Iniciar sesión
        </CustomButton>
      </Box>
    </CustomFormBox>
  );
};

export default LoginPage;
