import axios from "axios";
import API_BASE_URL from "./api";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;
