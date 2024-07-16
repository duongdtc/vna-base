import { Passenger } from '@services/axios/axios-data';

export type PassengerUpdateForm = {
  Passengers: Array<
    Pick<
      Passenger,
      'GivenName' | 'Surname' | 'BirthDate' | 'Gender' | 'PaxType'
    >
  >;
} & {
  System: string;
  Airline: string;
  BookingCode: string;
  BookingId: string;
};
