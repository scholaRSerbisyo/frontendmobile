import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.0.2.2:8000/api'; // For Android Emulator
// const API_URL = 'http://localhost:8000/api'; // For iOS Simulator
// const API_URL = 'http://YOUR_MACHINE_IP:8000/api'; // For physical device

export interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiErrorResponse {
  message: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting login with:', { email });
    const response = await api.post<{ access_token: string }>('/login', { email, password });
    console.log('Login response:', response.data);
    const { access_token } = response.data;
    await SecureStore.setItemAsync('authToken', access_token);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const signup = async (userData: any) => {
  try {
    const response = await api.post<{ access_token: string }>('/register', userData);
    const { access_token } = response.data;
    await SecureStore.setItemAsync('authToken', access_token);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateAccount = async (userData: any) => {
  try {
    const response = await api.patch<User>('/user', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
    await SecureStore.deleteItemAsync('authToken');
  } catch (error) {
    handleApiError(error);
  }
};

export const getUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/user');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getParticipants = async () => {
  try {
    const response = await api.get<User[]>('/participants');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      const errorMessage = (error.response.data as ApiErrorResponse)?.message || 'An error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your network connection.');
    } else {
      console.error('Error setting up request:', error.message);
      throw new Error('An error occurred while setting up the request.');
    }
  } else {
    console.error('Non-Axios error:', error);
    throw new Error('An unexpected error occurred.');
  }
};

