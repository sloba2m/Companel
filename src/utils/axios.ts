import type { Method, AxiosRequestConfig } from 'axios';

import qs from 'qs';
import axios from 'axios';

import { CONFIG } from 'src/config-global';

import getKeycloak from './keycloakService';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const keycloak = getKeycloak();

    if (!keycloak || !keycloak.authenticated) return null;

    await keycloak.updateToken(30);
    const { token } = keycloak;

    const res = await axiosInstance.get(url, {
      ...config,
      withCredentials: true,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`,
      },
      params: config?.params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const mutationFetcher = async <T = any>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const keycloak = getKeycloak();
    await keycloak.updateToken(30);
    const { token } = keycloak;

    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      ...config,
      withCredentials: true,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`${method} mutation failed:`, error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
