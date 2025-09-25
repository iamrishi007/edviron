// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://edviron-server.onrender.com", // keep this
  headers: { "Content-Type": "application/json" },
});

// attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- API functions ----
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ✅ createPayment must call backend correctly
export const createPayment = (data) => {
  // ensure full URL is used if needed
  return API.post("/payments/create-payment", data);
};

export const getAllTransactions = (params) => API.get("/transactions", { params });
export const getTransactionsBySchool = (school_id) =>
  API.get(`/transactions/school/${school_id}`);
export const checkTransactionStatus = (custom_order_id) =>
  API.get(`/transactions/status/${custom_order_id}`);

// optional: global error logger
API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default API;
