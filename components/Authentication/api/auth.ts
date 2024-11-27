import axios from 'axios';
import API_URL from '~/constants/constants';

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('Attempting to connect to:', `${API_URL}/api/user/login`);

    // First, get CSRF cookie
    await axios.get(`${API_URL}/sanctum/csrf-cookie`);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    const data = {
      email: email,
      password: password
    };

    const response = await axios.post(`${API_URL}/api/user/login`, data, { 
      headers,
      withCredentials: true, // This is important for handling cookies
      timeout: 10000, // 10 seconds timeout
    });

    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error details:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('The login request timed out. Please check your internet connection and try again.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      // Handle specific error responses from the server
      if (error.response.status === 422) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }
    }
    throw error;
  }
};

