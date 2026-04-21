import axios from "axios";

const api = axios.create({
  baseURL: "/api", // This automatically adds /api to all your requests
  headers: {
    "Content-Type": "application/json",
  },
});

// This is the "Interceptor" we talked about.
// It logs every error globally so you don't have to!
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Global API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
