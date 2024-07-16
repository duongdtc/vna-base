/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Booking, FareInfo } from '@services/axios/axios-data';

export const getDefaultValues = (bookingDetail: Booking) => {
  const ADTs: Array<FareInfo> = [];
  for (
    let i = 0;
    i < (bookingDetail?.FareInfos ?? []).length;
    i += bookingDetail?.Passengers?.length ?? 0
  ) {
    ADTs.push(bookingDetail?.FareInfos![i]);
  }

  return {
    isCancelAll: true,
    routes: bookingDetail?.Flights?.flatMap((flight, idx) =>
      flight.Segments?.map(sm => ({
        ...sm,
        ...ADTs[idx],
        isSelected: true,
      })),
    ),
  };
};
