import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER_URL;

const instance = axios.create({
  baseURL: SERVER,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
