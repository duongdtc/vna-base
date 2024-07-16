import { Ancillary, Seat } from '@services/axios/axios-ibe';

export function calculateTotalPrice(
  services: Array<any>,
  passengerCount: number,
  totalFareFlight: number,
) {
  let total = totalFareFlight;

  // có phải đang tách họ tên không
  const isSplitFullName = services[0] as boolean;

  for (let i = 0; i < passengerCount; ++i) {
    const firstIndexOfPassenger = i * 6 + 1;

    // nếu không tách họ tên và FullName đang trống thì bỏ qua passenger này
    if (!isSplitFullName && services[firstIndexOfPassenger] === '') {
      continue;
    }

    // nếu tách họ tên và FirstName, LastName đang trống thì bỏ qua passenger này
    if (
      isSplitFullName &&
      services[firstIndexOfPassenger + 1] === '' &&
      services[firstIndexOfPassenger + 2] === ''
    ) {
      continue;
    }

    //PreSeats
    total += (
      services[firstIndexOfPassenger + 3] as Array<
        Array<Seat | null | undefined>
      >
    ).reduce(
      (tas, currArrSeat) =>
        tas + currArrSeat.reduce((ts, s) => ts + (s?.Price ?? 0), 0),
      0,
    );

    //Baggages

    total += (services[firstIndexOfPassenger + 4] as Array<Ancillary>).reduce(
      (tb, currBaggage) => tb + (currBaggage?.Price ?? 0),
      0,
    );

    //Services

    total += (
      services[firstIndexOfPassenger + 5] as Array<Array<Array<Ancillary>>>
    ).reduce(
      (ta2s, currArr2Service) =>
        ta2s +
        currArr2Service.reduce(
          (tas, currArrService) =>
            tas + currArrService.reduce((ts, s) => ts + (s.Price ?? 0), 0),
          0,
        ),
      0,
    );
  }

  return total;
}
