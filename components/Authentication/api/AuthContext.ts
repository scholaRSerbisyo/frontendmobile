import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.1.34:8000/api'; // Update this line

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
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
        console.log('Attempting login with:', { email, password });
        const response = await api.post('/login', { email, password });
        console.log('Login response:', response.data);
        const { token } = response.data;
        await SecureStore.setItemAsync('authToken', token);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
        }
        throw error;
    }
};

export const signup = async (userData: any) => {
    try {
        const response = await api.post('/register', userData);
        const { token } = response.data;
        await SecureStore.setItemAsync('authToken', token);
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export const updateAccount = async (userData: any) => {
    try {
        const response = await api.patch('/user', userData);
        return response.data;
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await api.post('/logout');
        await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const getUser = async () => {
    try {
        const response = await api.get('/user');
        return response.data;
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
};

export const getParticipants = async () => {
    try {
        const response = await api.get('/participants');
        return response.data;
    } catch (error) {
        console.error('Get participants error:', error);
        throw error;
    }
};
