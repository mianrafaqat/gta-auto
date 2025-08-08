import axios from "axios";

import { HOST_API } from "src/config-global";
import { API_BASE_URL } from "src/config/app";

// ----------------------------------------------------------------------

// Use API_BASE_URL from app config if HOST_API is not set
const baseURL = HOST_API || API_BASE_URL;

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error?.response?.description) || "Something went wrong"
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: "/api/chat",
  kanban: "/api/kanban",
  calendar: "/api/calendar",
  auth: {
    me: "/api/auth/me",
    login: {
      user: "/api/user/login",
    },
    register: "/api/user/register",
    fetchToken: "/login/fetchToken",
  },
  mail: {
    list: "/api/mail/list",
    details: "/api/mail/details",
    labels: "/api/mail/labels",
  },
  post: {
    list: "/api/post/list",
    details: "/api/post/details",
    latest: "/api/post/latest",
    search: "/api/post/search",
  },
  product: {
    list: "/api/products",
    details: "/api/product/details",
    search: "/api/product/search",
    getById: (id) => `/api/products/${id}`,
  },
};
