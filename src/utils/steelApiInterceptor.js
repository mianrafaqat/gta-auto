import axios from 'axios';

import { STEEL_LISTING_API_BASE_URL } from 'src/config/app';

import { paths } from 'src/routes/paths';
import { ACCESS_TOKEN_KEY } from './constants';

const steelApi = axios.create({
  baseURL: STEEL_LISTING_API_BASE_URL,
});

steelApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error?.response?.data) || 'Something went wrong')
);
steelApi.interceptors.request.use((config) => {
  const authToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  config.headers.Authorization = 'Bearer ' + authToken;
  return config;
});

steelApi.interceptors.response.use(
  (response) => {
    if (response?.data?.response?.message === 'Login has expired. Please login again') {
      window.location.href = paths.auth.amplify.login;
    }
    return response;
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default steelApi;
