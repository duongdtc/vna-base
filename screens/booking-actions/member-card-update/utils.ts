/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Booking, Passenger } from '@services/axios/axios-data';
import { MemberCardUpdateForm } from './type';

export function getDefaultValues(bookingDetail: Booking): MemberCardUpdateForm {
  const Passengers = bookingDetail?.Passengers?.map(psg => ({
    ...psg,

    ListMembership: [
      {
        Airline: bookingDetail!.Airline!,
        MembershipID: psg.Membership,
      },
    ],
    Membership: psg.Membership,
    Gender: psg.Gender,
    GivenName: psg.GivenName,
    Surname: psg.Surname,
    PaxType: psg.PaxType,
    Type: psg.PaxType,
  })).sort(function (a, b) {
    if (a.PaxType! < b.PaxType!) {
      return -1;
    }

    if (a.PaxType! > b.PaxType!) {
      return 1;
    }

    return 0;
  });

  return {
    ListPassenger: Passengers as Array<Passenger>,
    System: bookingDetail!.System!,
    Airline: bookingDetail!.Airline!,
    BookingCode: bookingDetail!.BookingCode!,
    BookingId: bookingDetail.Id!,
  };
}
