/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DEFAULT_CURRENCY } from '@env';
import { AirOptionCustom, FlightOfPassengerForm } from '@vna-base/screens/flight/type';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import { ANCILLARY_TYPE, System, getState } from '@vna-base/utils';
import { FlightChangeForm, Passenger } from './type';

export function generateInitialForm(
  listSelectedFlight: Array<AirOptionCustom>,
) {
  const { bookingId } = getState('bookingAction').currentFeature;

  const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const tempInitData: FlightChangeForm = {
    newFlights: [],
    oldFlights: (bookingDetail?.Flights ?? []).map(fj => {
      const price = bookingDetail?.Charges?.filter(
        c => c.StartPoint === fj.StartPoint && c.EndPoint === fj.EndPoint,
      ).reduce((total, curr) => total + (curr.Amount ?? 0), 0);

      //@ts-ignore
      return {
        FareOption: {
          TotalFare: price,
          Currency: bookingDetail?.Currency ?? DEFAULT_CURRENCY,
        },
        StartPoint: fj.StartPoint,
        EndPoint: fj.EndPoint,
        Airline: fj.Airline,
        StartDate: fj.DepartDate,
        EndDate: fj.ArriveDate,
        ListSegment: fj.Segments,
      } as FlightOfPassengerForm;
    }),
    newPassengers: [],
    oldAncillaries: { baggages: [], preSeats: [], services: [] },
  };

  bookingDetail?.Ancillaries?.forEach(a => {
    const ancillary = {
      ...a,
      Passenger: bookingDetail?.Passengers?.find(p => p.Id === a.PassengerId),
    };

    if (a.Type === ANCILLARY_TYPE.BAGGAGE) {
      tempInitData.oldAncillaries.baggages.push(ancillary);
    } else if (a.Type === ANCILLARY_TYPE.PRESEAT) {
      tempInitData.oldAncillaries.preSeats.push(ancillary);
    } else {
      tempInitData.oldAncillaries.services.push(ancillary);
    }
  });

  listSelectedFlight.forEach(airOption => {
    airOption.ListFlightOption![0]?.ListFlight?.forEach(flight => {
      tempInitData.newFlights.push({
        ...flight,
        FareOption:
          airOption.ListFlightOption![0].ListFlight!.length > 1
            ? undefined
            : airOption.ListFareOption![0],
        FlightOptionId: airOption.ListFlightOption![0].OptionId!,
        AirlineOptionId: airOption.OptionId!,
        System: bookingDetail?.System as System,
        ListSegment: (flight.ListSegment ?? []).map(sgm => ({
          ...sgm,
          FareClass: airOption.ListFareOption![0].FareClass,
        })),
      });
    });
  });

  (bookingDetail?.Passengers ?? []).forEach(passenger => {
    const PreSeats = new Array(tempInitData.newFlights.length);
    const Baggages = new Array(tempInitData.newFlights.length);
    const Services = new Array(tempInitData.newFlights.length);
    tempInitData.newFlights.forEach((fl, flightIndex) => {
      PreSeats[flightIndex] = new Array(fl.ListSegment!.length);
      Services[flightIndex] = new Array(fl.ListSegment!.length);
    });

    tempInitData.newPassengers.push({
      ...passenger,
      PreSeats,
      Baggages,
      Services,
    } as Passenger);
  });

  // if (bookingDetail.System === System.VJ) {
  //   bookingDetail.FlightAncillaries?.forEach(a => {
  //     const paxIdx = bookingDetail.FlightPassengers!.findIndex(
  //       p => p.Id === a.PassengerId,
  //     );

  //     const ancillary = {
  //       ...a,
  //       Passenger: bookingDetail.FlightPassengers![paxIdx],
  //     };

  //     if (a.Type === ANCILLARY_TYPE.BAGGAGE) {
  //       const flIdx = tempInitData.newFlights.findIndex(
  //         fl =>
  //           fl.StartPoint === a.StartPoint &&
  //           fl.EndPoint === a.EndPoint &&
  //           fl.Leg === a.Leg,
  //       );
  //       tempInitData.newPassengers[paxIdx].Baggages[flIdx] = ancillary;
  //     } else if (a.Type === ANCILLARY_TYPE.PRESEAT) {
  //       const flIdx = tempInitData.newFlights.findIndex(
  //         fl =>
  //           fl.StartPoint === a.StartPoint &&
  //           fl.EndPoint === a.EndPoint &&
  //           fl.Leg === a.Leg,
  //       );

  //       const smIdx = tempInitData.newFlights[flIdx].ListSegment!.findIndex(
  //         sm =>
  //           sm.StartPoint === a.StartPoint &&
  //           sm.EndPoint === a.EndPoint &&
  //           sm.Leg === a.Leg,
  //       );

  //       tempInitData.newPassengers[paxIdx].PreSeats[flIdx][smIdx] = ancillary;
  //     } else {
  //       const flIdx = tempInitData.newFlights.findIndex(
  //         fl =>
  //           fl.StartPoint === a.StartPoint &&
  //           fl.EndPoint === a.EndPoint &&
  //           fl.Leg === a.Leg,
  //       );

  //       const smIdx = tempInitData.newFlights[flIdx].ListSegment!.findIndex(
  //         sm =>
  //           sm.StartPoint === a.StartPoint &&
  //           sm.EndPoint === a.EndPoint &&
  //           sm.Leg === a.Leg,
  //       );

  //       tempInitData.newPassengers[paxIdx].Services[flIdx][smIdx].push(
  //         ancillary,
  //       );
  //     }
  //   });
  // }

  return tempInitData;
}
