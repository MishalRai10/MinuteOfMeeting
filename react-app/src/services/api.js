// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT interceptor
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
const generateSummary = async (content) => {
  try {
    const response = await api.post('/api/summarize', { content });
    return response.data;
  } catch (error) {
    throw new Error('Failed to generate summary');
  }
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload file');
  }
};

const sendEmail = async (formData) => {
  try {
    const response = await api.post('/api/send-email', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'  // Required for file uploads
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send email');
  }
};

const login = async (username, password) => {
  try {
    const response = await api.post('/api/login', { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || 'Login failed');
  }
};

const register = async (username, password) => {
  try {
    const response = await api.post('/api/register', { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || 'Registration failed');
  }
};

// New API functions for Profile component
const getUserProfile = async () => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data;
  } catch (error) {
    if (error.response?.status === 422) {
      console.error('Unprocessable Entity:', error.response.data);
      throw new Error('Invalid token or request data');
    }
    console.error('Profile fetch error:', error.response?.data || error.message);
    throw new Error('Failed to fetch user profile');
  }
};


const getUserMinutes = async () => {
  try {
    const response = await api.get('/api/user/minutes');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user minutes');
  }
};

const deleteMeetingMinute = async (minuteId) => {
  try {
    const response = await api.delete(`/api/user/minutes/${minuteId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete meeting minute');
  }
};

export { 
  generateSummary,
  uploadFile,
  sendEmail,
  login,
  register,
  getUserProfile,
  getUserMinutes,
  deleteMeetingMinute
};
