import { FlightOfPassengerForm } from '@vna-base/screens/flight/type';
import {
  Ancillary,
  Passenger as PassengerAxios,
} from '@services/axios/axios-data';

export type Passenger = PassengerAxios & {
  PreSeats: Array<Array<Ancillary | null | undefined>>;
  Baggages: Array<Ancillary>;
  Services: Array<Array<Array<Ancillary>>>;
};

export type Flight = FlightOfPassengerForm & {
  isSelected?: boolean;
};

export type FlightChangeForm = {
  newPassengers: Array<Passenger>;
  oldAncillaries: {
    preSeats: Array<Ancillary>;
    baggages: Array<Ancillary>;
    services: Array<Ancillary>;
  };
  newFlights: Array<Flight>;
  oldFlights: Array<Flight>;
};
