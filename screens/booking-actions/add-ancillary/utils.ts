/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Booking } from '@services/axios/axios-data';
import { ANCILLARY_TYPE } from '@vna-base/utils';
import { AddAncillaryForm } from './type';

export const generateInitialAncillaryUpdateForm = (flBooking: Booking) => {
  const tempInitData: AddAncillaryForm = {
    passengers: [],
    flights: [],
  };

  flBooking.Passengers?.forEach(passenger => {
    const Baggages = new Array(flBooking.Flights!.length);
    const Services = new Array(flBooking.Flights!.length);

    flBooking.Flights!.forEach(fl => {
      Services[fl.Leg!] = new Array(fl.Segments!.length);
    });

    tempInitData.passengers.push({
      ...passenger,
      Baggages,
      Services,
    });
  });

  flBooking.Ancillaries?.forEach(a => {
    if (a.Type === ANCILLARY_TYPE.OTHER) {
      const flIdx = flBooking.Flights!.findIndex(f => f.Leg === a.Leg);

      const smIdx = flBooking.Flights![flIdx]?.Segments?.findIndex(
        s => s.StartPoint === a.StartPoint && s.EndPoint === a.EndPoint,
      );

      const passengerIdx = tempInitData.passengers.findIndex(
        p => p.Id === a.PassengerId,
      );

      tempInitData.passengers[passengerIdx].Services[flIdx][smIdx!].push({
        Value: a.Value,
        Price: a.Price,
        isInit: true,
      });
    } else if (a.Type === ANCILLARY_TYPE.BAGGAGE) {
      const flIdx = flBooking.Flights!.findIndex(f => f.Leg === a.Leg);

      const passengerIdx = tempInitData.passengers.findIndex(
        p => p.Id === a.PassengerId,
      );

      tempInitData.passengers[passengerIdx].Baggages[flIdx] = {
        Value: a.Value,
        Price: a.Price,
        isInit: true,
      };
    }
  });

  return tempInitData;
};
