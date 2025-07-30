import axios from 'axios';

import { API_BASE_URL } from 'src/config/app';

import { paths } from 'src/routes/paths';
import { ACCESS_TOKEN_KEY } from './constants';

const gtaAutosInstance = axios.create({
  baseURL: API_BASE_URL,
});

gtaAutosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('response: ', error?.response?.data);
    return Promise.reject(error?.response?.data || 'Something went wrong');
  }
);
gtaAutosInstance.interceptors.request.use((config) => {
  const authToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  config.headers.Authorization = 'Bearer ' + authToken;
  return config;
});

// gtaAutosInstance.interceptors.response.use(
//   (response) => {
//     if (response?.data?.response?.message === 'Login has expired. Please login again') {
//       window.location.href = paths.auth.amplify.login;
//     }
//     return response;
//   },
//   (error) => {
//     return Promise.reject(error?.response?.data || 'Something went wrong');
//   }
// );

export default gtaAutosInstance;
