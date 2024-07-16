/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Order } from '@services/axios/axios-data';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { realmRef } from '@services/realm/provider';
import dayjs from 'dayjs';
import isNil from 'lodash.isnil';
import omitBy from 'lodash.omitby';
import { UpdateMode } from 'realm';
import { createBookingFromAxios } from './bookings';

export function createOrderFromAxios(
  order: Order,
  mode?: UpdateMode.Never | UpdateMode.All | UpdateMode.Modified | boolean,
) {
  order.Tickets?.forEach(tk => (tk.Charges = null));

  //@ts-ignore
  order.Bookings =
    order.Bookings?.sort(
      (firstBk, lastBk) =>
        dayjs(firstBk.DepartDate).unix() - dayjs(lastBk.DepartDate).unix(),
    )?.map(bk => {
      createBookingFromAxios(bk, UpdateMode.Modified);
      return bk.Id;
    }) ?? [];

  const newData: Order = omitBy(order, isNil);

  //@ts-ignore
  newData.ListAirline = newData.ListAirline?.map(al => al.Code) ?? [];
  //@ts-ignore
  newData.ListAirport = newData.ListAirport?.map(ap => ap.Code) ?? [];
  //@ts-ignore
  newData.ListAircraft = newData.ListAircraft?.map(an => an.Code) ?? [];

  realmRef.current?.create(
    OrderRealm.schema.name,
    {
      _id: newData.Id,
      ...newData,
    },
    mode,
  );
}
