/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Flight, SearchForm } from '@screens/flight/type';

import isEmpty from 'lodash.isempty';

export function getListRoute({
  Type,
  Flights,
}: Pick<SearchForm, 'Type' | 'Flights'>) {
  let listRoute: Array<{
    Leg: number;
    StartPoint: Flight;
    EndPoint: Flight;
    DepartDate: Date;
  }> = [];

  //nếu toàn bộ sân bay ở việt nam thì là bay nội địa, nếu không thì là quốc tế. nếu quốc tế thì CombineFlight = true
  let combineFlight = false;

  switch (Type) {
    case 'OneStage':
      listRoute = [
        {
          Leg: 0,
          StartPoint: Flights[0].airport.takeOff!,
          EndPoint: Flights[0].airport.landing!,
          DepartDate: Flights[0].date.departureDay,
        },
      ];

      combineFlight =
        Flights[0].airport.takeOff!.CountryCode !== 'VN' ||
        Flights[0].airport.landing!.CountryCode !== 'VN';

      break;

    case 'RoundStage':
      listRoute = [
        {
          Leg: 0,
          StartPoint: Flights[0].airport.takeOff!,
          EndPoint: Flights[0].airport.landing!,
          DepartDate: Flights[0].date.departureDay,
        },
        {
          Leg: 1,
          StartPoint: Flights[0].airport.landing!,
          EndPoint: Flights[0].airport.takeOff!,
          DepartDate: Flights[0].date.backDay as Date,
        },
      ];

      combineFlight =
        Flights[0].airport.takeOff!.CountryCode !== 'VN' ||
        Flights[0].airport.landing!.CountryCode !== 'VN';

      break;

    default:
      listRoute = Flights.filter(fl => !isEmpty(fl.airport.landing)).map(
        (fl, i) => {
          combineFlight =
            combineFlight ||
            fl.airport.takeOff!.CountryCode !== 'VN' ||
            fl.airport.landing!.CountryCode !== 'VN';

          return {
            Leg: i,
            StartPoint: fl.airport.takeOff!,
            EndPoint: fl.airport.landing!,
            DepartDate: fl.date.departureDay,
          };
        },
      );
      break;
  }

  return {
    listRoute,

    /**
     * có phải bay nội địa hay không
     */
    isDomestic: !combineFlight,
  };
}
