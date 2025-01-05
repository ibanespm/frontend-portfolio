import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token de autorización
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.geztItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejador de errores de API
export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // Error de respuesta del servidor
    if (error.response) {
      console.error('Error de servidor:', error.response.data);
      return error.response.data;
    } 
    // Error de solicitud
    else if (error.request) {
      console.error('No se recibió respuesta:', error.request);
      return { message: 'No se pudo conectar con el servidor' };
    }
    // Error de configuración
    else {
      console.error('Error de configuración:', error.message);
      return { message: 'Error en la configuración de la solicitud' };
    }
  }
  // Errores no relacionados con Axios
  console.error('Error desconocido:', error);
  return { message: 'Ocurrió un error inesperado' };
};