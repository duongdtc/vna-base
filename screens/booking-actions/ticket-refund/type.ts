import { Ticket } from '@services/axios/axios-data';

export type RfndTicketForm = {
  isCancelBooking: boolean;
  isRfndAllTicket: boolean;
  tickets: Array<Ticket & { isSelected: boolean }>;
};
