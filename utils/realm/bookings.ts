/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Booking } from '@services/axios/axios-data';
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
