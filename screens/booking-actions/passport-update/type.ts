import { Passenger } from '@services/axios/axios-ibe';

export type PassportUpdateForm = {
  ListPassenger: Array<
    Pick<Passenger, 'GivenName' | 'Surname' | 'Passport' | 'DateOfBirth'>
  >;
} & {
  System: string;
  Airline: string;
  BookingCode: string;
  BookingId: string;
};
