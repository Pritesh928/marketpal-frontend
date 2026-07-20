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
    register: (data) => axios.post(`${BASE_URL}/auth/register`, data, {
      headers: { "Content-Type": "application/json" }
    }),
    login: (data) => axios.post(`${BASE_URL}/auth/login`, data, {
      headers: { "Content-Type": "application/json" }
    }),
    verifyEmail: (token) => axios.get(`${BASE_URL}/auth/verify-email?token=${token}`),
  };

  export const productAPI = {
  getAll: () => {
    return axios.get(`${BASE_URL}/products/`);
  },
  getById: (id) => {
    return axios.get(`${BASE_URL}/products/${id}`);
  },
  search: (keyword) => {
    return axios.get(`${BASE_URL}/products/search?keyword=${keyword}`);
  },
  getMyProducts: () => {
    const token = localStorage.getItem("token");
    return axios.get(`${BASE_URL}/products/my-products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  create: (data) => {
    const token = localStorage.getItem("token");
    return axios.post(`${BASE_URL}/products/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  },
  update: (id, data) => {
    const token = localStorage.getItem("token");
    return axios.put(`${BASE_URL}/products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  },
  delete: (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${BASE_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  uploadImage: (formData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${BASE_URL}/products/upload-image`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
};

export default api;