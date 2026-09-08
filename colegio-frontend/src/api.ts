import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ej: https://colegio-1-zths.onrender.com/api
});

export default api;
