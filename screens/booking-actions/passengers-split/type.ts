import { Passenger } from '@services/axios/axios-data';

export type SplitPassengersForm = {
  BookingId?: string;
  BookingCode?: string;
  Airline?: string;
  System?: string;
  passengers: Array<Passenger & { isSelected: boolean }>;
  createNewOrder: boolean;
};
