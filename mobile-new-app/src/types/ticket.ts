export type TicketStatus = 'open' | 'in_progress' | 'closed';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  userId: string;
  assignedTo?: string;
};

export type Message = {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
  attachments?: string[];
};

export type CreateTicketDto = {
  title: string;
  description: string;
};

export type UpdateTicketDto = {
  status?: TicketStatus;
  assignedTo?: string;
}; 