/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Booking } from '@services/axios/axios-data';
import {
  AircraftRealm,
  AirlineRealm,
  AirportRealm,
} from '@services/realm/models';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import isNil from 'lodash.isnil';
import omitBy from 'lodash.omitby';
import { UpdateMode } from 'realm';

export function createBookingFromAxios(
  booking: Booking,
  mode?: UpdateMode.Never | UpdateMode.All | UpdateMode.Modified | boolean,
) {
  booking.Tickets?.forEach(tk => (tk.Charges = null));

  const newData: Booking = omitBy(booking, isNil);

  //@ts-ignore
  newData.ListAirline = newData.ListAirline?.map(al => al.Code) ?? [];
  //@ts-ignore
  newData.ListAirport = newData.ListAirport?.map(ap => ap.Code) ?? [];
  //@ts-ignore
  newData.ListAircraft = newData.ListAircraft?.map(an => an.Code) ?? [];

  realmRef.current?.create(
    BookingRealm.schema.name,
    {
      _id: newData.Id,
      ...newData,
    },
    mode,
  );
}

export function getBookingFromRealm(id: string): Booking {
  const booking = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    id,
  );

  const temp = booking?.toJSON() as BookingRealm;

  //@ts-ignore
  temp.ListAirline =
    temp.ListAirline?.map(code => {
      const al = realmRef.current?.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        code,
      );

      return al?.toJSON();
    }) ?? [];
  //@ts-ignore
  temp.ListAirport =
    temp.ListAirport?.map(code => {
      const al = realmRef.current?.objectForPrimaryKey<AirportRealm>(
        AirportRealm.schema.name,
        code,
      );

      return al?.toJSON();
    }) ?? [];
  //@ts-ignore
  temp.ListAircraft =
    temp.ListAircraft?.map(code => {
      const al = realmRef.current?.objectForPrimaryKey<AircraftRealm>(
        AircraftRealm.schema.name,
        code,
      );

      return al?.toJSON();
    }) ?? [];

  return temp;
}
