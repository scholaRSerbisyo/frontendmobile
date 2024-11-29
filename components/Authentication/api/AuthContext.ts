import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: `http://10.0.2.2:8000/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email: string, password: string) => {
    try {
        console.log('Attempting login with:', { email, password });
        const response = await api.post('/user/login', { email, password });
        console.log('Login response:', response.data);
        const { token } = response.data;
        await AsyncStorage.setItem('authToken', token);
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
        await api.post('/user/signup', userData);
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export const updateAccount = async (userData: any) => {
    try {
        await api.patch('/user/me', userData);
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await api.post('/user/logout');
        await AsyncStorage.removeItem('authToken');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const getUser = async () => {
    try {
        const response = await api.get('/user/me');
        return response.data;
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
};

export const getParticipants = async () => {
    try {
        const response = await api.get('/user/participants');
        return response.data;
    } catch (error) {
        console.error('Get participants error:', error);
        throw error;
    }
};

