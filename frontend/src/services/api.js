import axios from "axios";

const api = axios.create({
  baseURL: "https://security-risk-backend-46f8.onrender.com/api/v1", // or your deployed FastAPI backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
