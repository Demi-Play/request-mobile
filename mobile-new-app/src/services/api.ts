import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginResponse, Ticket, Message, Chat } from '../types';
import { Platform } from 'react-native';
import { CreateTicketDto, UpdateTicketDto } from '../types/ticket';

// Для Android эмулятора используем 10.0.2.2 вместо localhost
// Для iOS эмулятора используем localhost
// Для реального устройства используем IP адрес компьютера
const BASE_URL = Platform.select({
  android: 'http://192.168.0.131:8000/api',
  ios: 'http://192.168.0.131:8000/api',
  default: 'http://192.168.0.131:8000/api',
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Добавляем таймаут в 10 секунд
});

// Request interceptor with logging
api.interceptors.request.use(async (config) => {
  console.log('Request URL:', `${config.baseURL}${config.url}`);
  console.log('Request Method:', config.method);
  console.log('Request Headers:', config.headers);
  
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
    console.log('JWT token found:', token);
  } else {
    console.log('No JWT token found in AsyncStorage');
  }
  
  if (config.data) {
    console.log('Request Data:', config.data);
  }
  
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Response interceptor with logging
api.interceptors.response.use(
  (response) => {
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    return response;
  },
  async (error) => {
    console.error('Response Error:', error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : error.message);

    // Если получаем 401, пробуем обновить токен
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await api.post('/token/refresh/', { refresh: refreshToken });
          const { access } = response.data;
          await AsyncStorage.setItem('token', access);
          
          // Повторяем исходный запрос с новым токеном
          error.config.headers.Authorization = `Token ${access}`;
          return api(error.config);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Если не удалось обновить токен, очищаем хранилище
        await AsyncStorage.multiRemove(['token', 'user']);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login/', { username, password });
    // Проверяем структуру ответа
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }
    
    // Проверяем наличие токена
    const token = response.data.token || response.data.access_token;
    if (!token) {
      throw new Error('Token not found in response');
    }
    
    // Проверяем наличие данных пользователя
    const user = response.data.user;
    if (!user) {
      throw new Error('User data not found in response');
    }
    
    return {
      token,
      user
    };
  },
  register: async (userData: {
    username: string;
    password: string;
    email: string;
    company: string;
    phone: string;
  }) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
};

export const tickets = {
  list: async (isAdmin?: boolean): Promise<Ticket[]> => {
    const endpoint = isAdmin ? '/tickets/all/' : '/tickets/';
    const { data } = await api.get(endpoint);
    return data;
  },
  create: async (title: string, description: string): Promise<Ticket> => {
    const { data } = await api.post('/tickets/', { title, description });
    return data;
  },
  get: async (id: number): Promise<Ticket> => {
    const { data } = await api.get(`/tickets/${id}/`);
    return data;
  },
  update: async (id: number, updates: { status?: string; priority?: string; description?: string }): Promise<Ticket> => {
    const { data } = await api.patch(`/tickets/${id}/`, updates);
    return data;
  },
  updateStatus: async (id: number, status: string): Promise<Ticket> => {
    const { data } = await api.patch(`/tickets/${id}/status/`, { status });
    return data;
  },
};

export const messages = {
  list: async (ticketId: number): Promise<Message[]> => {
    const { data } = await api.get(`/tickets/${ticketId}/messages/`);
    return data;
  },
  send: async (ticketId: number, text: string): Promise<Message> => {
    const { data } = await api.post(`/tickets/${ticketId}/messages/`, { 
      ticket: ticketId,
      text 
    });
    return data;
  },
  markAsRead: async (messageId: number): Promise<void> => {
    await api.patch(`/messages/${messageId}/mark_read/`);
  },
};

export const chats = {
  list: async (): Promise<Chat[]> => {
    const { data } = await api.get('/chats/');
    return data;
  },
  get: async (ticketId: number): Promise<Chat> => {
    const { data } = await api.get(`/chats/${ticketId}/`);
    return data;
  },
};

export const users = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile/');
    return data;
  },
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.patch('/auth/profile/', userData);
    return data;
  },
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password/', { old_password: oldPassword, new_password: newPassword });
  }
};

export const ticketApi = {
  // Получение списка заявок
  getTickets: async (): Promise<Ticket[]> => {
    const response = await api.get('/tickets/');
    return response.data;
  },

  // Получение одной заявки
  getTicket: async (id: string): Promise<Ticket> => {
    const response = await api.get(`/tickets/${id}/`);
    return response.data;
  },

  // Создание заявки
  createTicket: async (data: CreateTicketDto): Promise<Ticket> => {
    const response = await api.post('/tickets/', data);
    return response.data;
  },

  // Обновление заявки
  updateTicket: async (id: string, data: UpdateTicketDto): Promise<Ticket> => {
    const response = await api.patch(`/tickets/${id}/`, data);
    return response.data;
  },

  // Получение сообщений заявки
  getTicketMessages: async (ticketId: string): Promise<Message[]> => {
    const response = await api.get(`/tickets/${ticketId}/messages/`);
    return response.data;
  },

  // Отправка сообщения
  sendMessage: async (ticketId: string, text: string): Promise<Message> => {
    const response = await api.post(`/tickets/${ticketId}/messages/`, { 
      text,
      ticket: ticketId 
    });
    return response.data;
  },
};

export default api; 