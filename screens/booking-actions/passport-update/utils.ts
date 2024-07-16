/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Booking, Passenger } from '@services/axios/axios-data';

export function getDefaultValues(bookingDetail: Booking) {
  const passengers = bookingDetail?.Passengers?.map(psg => ({
    ...psg,
    GivenName: psg.GivenName,
    Surname: psg.Surname,
    BirthDate: psg.BirthDate,
    Passport: {
      DocumentCode: psg.DocumentNumb,
      DocumentExpiry: psg.DocumentExpiry,
      Nationality: psg.Nationality,
      IssueCountry: psg.IssueCountry,
    },
    DateOfBirth: psg.BirthDate,
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
    System: bookingDetail.System!,
    Airline: bookingDetail.Airline!,
    BookingCode: bookingDetail.BookingCode!,
    BookingId: bookingDetail.Id!,
    ListPassenger: passengers as Array<Passenger>,
  };
}
