import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;

const client = axios.create({
  baseURL: `${BASE}/api`,
});

client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("kemudi_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default client;
export const BACKEND_URL = BASE;
