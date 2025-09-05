import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, STORAGE_USER_KEY } from 'src/utils/constants';
import gtaAutosInstance from 'src/utils/requestInterceptor';

// ----------------------------------------------------------------------

export const setSession = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const storeUserDetailsSessionStorage = (userDetails) =>
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userDetails));

export const emptySessionStorage = () => {
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await gtaAutosInstance.post('/api/user/refresh-token', {
      refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
    storeTokens(newAccessToken, newRefreshToken);
    
    return newAccessToken;
  } catch (error) {
    // If refresh token is invalid/expired, clear session
    emptySessionStorage();
    throw error;
  }
};
