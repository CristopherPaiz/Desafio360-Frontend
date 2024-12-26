import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Email, Lock } from "@mui/icons-material";
import { loginSchema } from "../Validations/validationsSchema";
import CustomFormBox from "../components/ui/CustomFormBox";
import CustomTypography from "../components/ui/CustomTypography";
import CustomInput from "../components/ui/CustomInput";
import CustomButton from "../components/ui/CustomButton";
import { Box } from "@mui/material";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your-token-here",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error en el login");
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
          register={register("usuario")}
          error={!!errors.usuario}
          helperText={errors.usuario?.message}
        />

        <CustomInput
          label="Contraseña"
          type="password"
          placeholder="********"
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
