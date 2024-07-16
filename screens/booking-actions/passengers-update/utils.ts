/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Booking } from '@services/axios/axios-data';

export function getDefaultValues(bookingDetail: Booking) {
  const passengers = bookingDetail?.Passengers?.map(psg => ({
    ...psg,
    Gender: psg.Gender,
    GivenName: psg.GivenName,
    Surname: psg.Surname,
    BirthDate: psg.BirthDate,
    PaxType: psg.PaxType,
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
    Passengers: passengers,
    System: bookingDetail.System!,
    Airline: bookingDetail.Airline!,
    BookingCode: bookingDetail.BookingCode!,
    BookingId: bookingDetail.Id!,
  };
}
