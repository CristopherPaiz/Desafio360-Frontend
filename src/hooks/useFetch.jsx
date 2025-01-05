import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  const request = useCallback(
    async (url, method = "GET", body = null, options = {}, timeout = 30000) => {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        // Preparar headers
        const headers = {};

        // Establecer `Content-Type` si no es multipart
        if (!options.img) {
          headers["Content-Type"] = "application/json";
        }

        // Agregar token si existe y no es una petición de login
        if (isAuthenticated || url.includes("/login")) {
          const token = getAuthToken();
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }
        }

        const requestBody = options.img ? body : body ? JSON.stringify(body) : null;

        const response = await fetch(url, {
          method,
          headers,
          body: requestBody,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Intentar obtener el cuerpo de la respuesta como JSON
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          // Si tenemos un mensaje en el cuerpo de la respuesta, usamos ese
          const errorMessage = data?.mensaje || `Error en la solicitud: ${response.statusText}`;
          setError(errorMessage);
          return {
            error: errorMessage,
            codigo: data?.codigo || response.status,
          };
        }

        return { data };
      } catch (err) {
        const message =
          err.name === "AbortError"
            ? "La solicitud ha sido abortada debido al tiempo de espera."
            : err.message || "Hubo un problema con la solicitud de la API.";

        setError(message);
        return { error: message };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return { loading, error, request };
};

export default useFetch;
