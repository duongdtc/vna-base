/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Booking } from '@services/axios/axios-data';
import { SeatMapUpdateForm } from './type';
import { ANCILLARY_TYPE } from '@vna-base/utils';

export const generateInitialSeatMapUpdateForm = (flBooking: Booking) => {
  const tempInitData: SeatMapUpdateForm = {
    passengers: [],
  };

  flBooking.Passengers?.forEach(passenger => {
    const PreSeats = new Array(flBooking.Flights!.length);

    flBooking.Flights!.forEach(fl => {
      PreSeats[fl.Leg!] = new Array(fl.Segments!.length);
    });

    tempInitData.passengers.push({
      ...passenger,
      PreSeats,
    });
  });

  flBooking.Ancillaries?.forEach(a => {
    if (a.Type === ANCILLARY_TYPE.PRESEAT) {
      const flIdx = flBooking.Flights!.findIndex(f => f.Leg === a.Leg);

      const smIdx = flBooking.Flights![flIdx]?.Segments?.findIndex(
        s => s.StartPoint === a.StartPoint && s.EndPoint === a.EndPoint,
      );

      const passengerIdx = tempInitData.passengers.findIndex(
        p => p.Id === a.PassengerId,
      );

      tempInitData.passengers[passengerIdx].PreSeats[flIdx][smIdx!] = {
        SeatNumber: a.Value,
        Price: a.Price,
        isInit: true,
      };
    }
  });

  return tempInitData;
};
