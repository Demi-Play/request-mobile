export type UserRole = 'admin' | 'manager' | 'user' | 'support';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  phone?: string;
  department?: string;
  position?: string;
  avatar?: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  company?: string;
  phone?: string;
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  user: User;
  specialist?: User;
  department: number;
  category: number;
  due_date?: string;
  attachments: string[];
  tags: string[];
}

export interface Message {
  id: number;
  text: string;
  timestamp: string;
  ticket: number;
  sender: {
    id: number;
    username: string;
    email: string;
    phone: string;
    company: string;
    role: string;
  };
  file: string | null;
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

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  ticket?: number;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface NotificationFilter {
  is_read?: boolean;
  type?: NotificationType;
  start_date?: string;
  end_date?: string;
} 