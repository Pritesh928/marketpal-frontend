import axios from "axios";

const BASE_URL = process.env.API_URL || "https://marketpal-backend-ol74.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  verifyEmail: (jwtToken) => api.get(`/auth/verify-email?jwtToken=${jwtToken}`),
};

export const productAPI = {
  getAll: () => api.get("/products/"),
  getById: (id) => api.get(`/products/${id}`),
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  getMyProducts: () => api.get("/products/my-products"),
  create: (data) => api.post("/products/", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImage: (formData) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${BASE_URL}/products/upload-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // no Content-Type — browser sets it with boundary
      },
    }
  );
  },
};

export default api;