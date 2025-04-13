import { User } from './index';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export type Ticket = {
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
};

export type Message = {
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
};

export type CreateTicketDto = {
  title: string;
  description: string;
};

export type UpdateTicketDto = {
  status?: TicketStatus;
  assignedTo?: string;
}; 