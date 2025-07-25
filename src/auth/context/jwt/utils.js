import { ACCESS_TOKEN_KEY, STORAGE_USER_KEY } from 'src/utils/constants';

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const storeAccessTokenSessionStorage = (accessToken) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

export const storeUserDetailsSessionStorage = (userDetails) =>
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userDetails));

export const emptySessionStorage = () => {
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
