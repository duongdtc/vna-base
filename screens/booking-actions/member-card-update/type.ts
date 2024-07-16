import { Passenger } from '@services/axios/axios-ibe';

export type MemberCardUpdateForm = {
  ListPassenger: Array<
    Pick<
      Passenger,
      'ListMembership' | 'GivenName' | 'Surname' | 'Gender' | 'Type'
    >
  >;
} & {
  System: string;
  Airline: string;
  BookingCode: string;
  BookingId: string;
};
