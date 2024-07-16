import { FlightChangeForm } from '../flight-change-detail/type';

export type TicketChangeForm = Pick<
  FlightChangeForm,
  'oldFlights' | 'newFlights'
>;
