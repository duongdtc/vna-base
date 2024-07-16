/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DEFAULT_CURRENCY } from '@env';
import { AirOptionCustom, FlightOfPassengerForm } from '@vna-base/screens/flight/type';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import { getState, System } from '@vna-base/utils';
import { TicketChangeForm } from './type';

export function generateInitialForm(
  listSelectedFlight: Array<AirOptionCustom>,
) {
  const { bookingId } = getState('bookingAction').currentFeature;

  const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const tempInitData: TicketChangeForm = {
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
  };

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

  return tempInitData;
}
