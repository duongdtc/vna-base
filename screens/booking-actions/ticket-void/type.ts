import { Ticket } from '@services/axios/axios-data';

export type VoidTicketForm = {
  isCancelBooking: boolean;
  isVoidAllTicket: boolean;
  tickets: Array<Ticket & { isSelected: boolean }>;
};
