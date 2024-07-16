import {
  Flight,
  Passenger as PassengerAxios,
} from '@services/axios/axios-data';
import { Ancillary } from '@services/axios/axios-ibe';

export type Passenger = PassengerAxios & {
  Services: Array<
    Array<
      Array<
        Ancillary & {
          /**
           * nếu là true thì tức là Seat này được đặt từ lúc booking chuyến bay,
           * biến này dùng trong phần update seat map
           */
          isInit?: boolean;
        }
      >
    >
  >;
  Baggages: Array<
    | (Ancillary & {
        /**
         * nếu là true thì tức là Seat này được đặt từ lúc booking chuyến bay,
         * biến này dùng trong phần update seat map
         */
        isInit?: boolean;
      })
    | null
    | undefined
  >;
};

export type AncillaryUpdateForm = {
  passengers: Array<Passenger>;
  // paxIdx/flightIdx
  oldBaggages: Array<Array<Ancillary>>;
  // paxIdx/flightIdx/segmentIdx
  oldServices: Array<Array<Array<Array<Ancillary>>>>;
};

export type ModalServicePickerRef = {
  present: (data: {
    listSelected: Array<string> | null | undefined;
    passengerIndex: number;
    segmentIndex: number;
    flight: Flight & { index: number };
  }) => void;
};

export type ModalBaggagePickerRef = {
  present: (data: {
    selected: string | null | undefined;
    passengerIndex: number;
    flightIndex: number;
  }) => void;
};
