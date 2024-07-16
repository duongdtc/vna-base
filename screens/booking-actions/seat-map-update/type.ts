import { Passenger as PassengerAxios } from '@services/axios/axios-data';
import { Seat } from '@services/axios/axios-ibe';

export type Passenger = PassengerAxios & {
  PreSeats: Array<
    Array<
      | (Seat & {
          /**
           * nếu là true thì tức là Seat này được đặt từ lúc booking chuyến bay,
           * biến này dùng trong phần update seat map
           */
          isInit?: boolean;
        })
      | null
      | undefined
    >
  >;
};

export type SeatMapUpdateForm = {
  passengers: Array<Passenger>;
};
