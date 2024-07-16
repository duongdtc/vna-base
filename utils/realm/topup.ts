import { EntryItem } from '@services/axios/axios-data';
import { TopupRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import isNil from 'lodash.isnil';
import omitBy from 'lodash.omitby';
import { UpdateMode } from 'realm';

export function createTopupFromAxios(
  entry: EntryItem,
  mode?: UpdateMode.Never | UpdateMode.All | UpdateMode.Modified | boolean,
) {
  entry.Account = null;
  entry.EntryTypeNavigation = null;
  const newData: EntryItem = omitBy(entry, isNil);

  realmRef.current?.create(
    TopupRealm.schema.name,
    {
      _id: newData.Id,
      ...newData,
    },
    mode,
  );
}
