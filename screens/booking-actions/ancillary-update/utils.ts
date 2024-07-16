/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Booking } from '@services/axios/axios-data';
import { AncillaryUpdateForm } from './type';
import { ANCILLARY_TYPE } from '@vna-base/utils';
import cloneDeep from 'lodash.clonedeep';

export const generateInitialAncillaryUpdateForm = (flBooking: Booking) => {
  const tempInitData: AncillaryUpdateForm = {
    passengers: [],
    oldBaggages: [],
    oldServices: [],
  };

  flBooking.Passengers?.forEach(passenger => {
    const Baggages = new Array(flBooking.Flights!.length);
    const Services = new Array(flBooking.Flights!.length);

    flBooking.Flights!.forEach(fl => {
      Services[fl.Leg!] = new Array(fl.Segments!.length).fill(new Array(0));
    });

    tempInitData.passengers.push({
      ...passenger,
      Baggages,
      Services,
    });
    tempInitData.oldBaggages.push(Baggages);
    tempInitData.oldServices.push(cloneDeep(Services));
  });

  flBooking.Ancillaries?.forEach(a => {
    if (a.Type === ANCILLARY_TYPE.OTHER || !a.Type) {
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
        Name: a.Name,
        isInit: true,
      });

      tempInitData.oldServices[passengerIdx][flIdx][smIdx!].push({
        Value: a.Value,
        Price: a.Price,
        Name: a.Name,
      });
    } else if (a.Type === ANCILLARY_TYPE.BAGGAGE) {
      const flIdx = flBooking.Flights!.findIndex(f => f.Leg === a.Leg);

      const passengerIdx = tempInitData.passengers.findIndex(
        p => p.Id === a.PassengerId,
      );

      tempInitData.passengers[passengerIdx].Baggages[flIdx] = {
        Value: a.Value,
        Price: a.Price,
        Name: a.Name,
        isInit: true,
      };

      tempInitData.oldBaggages[passengerIdx][flIdx] = {
        Value: a.Value,
        Price: a.Price,
        Name: a.Name,
      };
    }
  });

  return tempInitData;
};
