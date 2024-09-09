/* eslint-disable no-undef */
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SERVER = process.env.SERVERURL;

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
