import { Ticket } from '@services/axios/axios-data';
import { FlightTicketInList } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import isNil from 'lodash.isnil';
import omitBy from 'lodash.omitby';
import { UpdateMode } from 'realm';

export function createFlightTicketInListFromAxios(
  ticket: Ticket,
  mode?: UpdateMode.Never | UpdateMode.All | UpdateMode.Modified | boolean,
) {
  ticket.Charges = null;
  const newData: Ticket = omitBy(ticket, isNil);

  realmRef.current?.create(
    FlightTicketInList.schema.name,
    {
      _id: newData.Id,
      ...newData,
    },
    mode,
  );
}
