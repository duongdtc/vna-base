import { Booking, Passenger } from '@services/axios/axios-data';
import { PassengerType } from '@vna-base/utils';

export function getDefaultValues(bookingDetail: Booking) {
  const initPassengers = bookingDetail?.Passengers?.map(psg => ({
    ...psg,
    isSelected: false,
  })).sort(function (a, b) {
    if (a.PaxType! < b.PaxType!) {
      return -1;
    }

    if (a.PaxType! > b.PaxType!) {
      return 1;
    }

    return 0;
  });

  const newListPsgs: Array<Passenger> = [];

  initPassengers?.forEach(passenger => {
    if (passenger.PaxType === PassengerType.ADT) {
      const infant = initPassengers?.filter(
        child =>
          child.PaxType === PassengerType.INF &&
          child.ParentId === passenger.PaxIndex,
      );
      const newPassenger = { ...passenger, Childrens: infant };
      newListPsgs?.push(newPassenger);
    }
  });

  const childrensPsg = initPassengers?.filter(
    item => item.PaxType === PassengerType.CHD,
  );

  return {
    passengers: newListPsgs.concat(childrensPsg ?? []),
    createNewOrder: true,
  };
}
