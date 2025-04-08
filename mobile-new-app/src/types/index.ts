export type UserRole = 'client' | 'specialist' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  company: string;
  phone: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  user: number;
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  ticket: number;
  user: number;
  is_read: boolean;
}

export interface Chat {
  id: number;
  ticket: number;
  messages: Message[];
  last_message: Message | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
} 