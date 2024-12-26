import { useState, useCallback } from "react";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, method = "GET", body = null, timeout = 30000) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer TOKEN AQUI PERRO",
        },
        body: body ? JSON.stringify(body) : null,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse?.message || `Error en la solicitud: ${response.statusText}`;
        setError(errorMessage);
        return { error: errorMessage };
      }

      const data = await response.json();
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
  }, []);

  return { loading, error, request };
};

export default useFetch;
