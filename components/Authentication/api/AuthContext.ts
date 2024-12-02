import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.8.166:8000/api'; // For Android Emulator

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
    const response = await api.post<{ access_token: string }>('/user/login', { email, password });
    console.log('Login response:', response.data);
    const { access_token } = response.data;
    
    // Ensure access_token is a string before storing
    if (typeof access_token !== 'string') {
      console.error('Invalid access_token type:', typeof access_token);
      throw new Error('Invalid access token received from server');
    }
    
    await SecureStore.setItemAsync('authToken', access_token);
    return response.data;
  } catch (error) {
    console.error('Login error details:', error);
    throw handleApiError(error);
  }
};

export const signup = async (userData: any) => {
  try {
    const response = await api.post<{ access_token: string }>('/register', userData);
    const { access_token } = response.data;
    
    // Ensure access_token is a string before storing
    if (typeof access_token !== 'string') {
      console.error('Invalid access_token type:', typeof access_token);
      throw new Error('Invalid access token received from server');
    }
    
    await SecureStore.setItemAsync('authToken', access_token);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAccount = async (userData: any) => {
  try {
    const response = await api.patch<User>('/user', userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    await SecureStore.deleteItemAsync('authToken');
  }
};

export const getUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/user');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getParticipants = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/participants');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response) {
      console.error('Response data:', axiosError.response.data);
      console.error('Response status:', axiosError.response.status);
      const errorMessage = axiosError.response.data?.message || 'An error occurred';
      return new Error(errorMessage);
    } else if (axiosError.request) {
      console.error('No response received:', axiosError.request);
      return new Error('No response from server. Please check your network connection.');
    } else {
      console.error('Error setting up request:', axiosError.message);
      return new Error('An error occurred while setting up the request.');
    }
  } else if (error instanceof Error) {
    console.error('Non-Axios error:', error.message);
    return error;
  } else {
    console.error('Unknown error:', error);
    return new Error('An unexpected error occurred.');
  }
};

