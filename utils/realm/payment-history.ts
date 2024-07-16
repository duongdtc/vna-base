import { Payment } from '@services/axios/axios-data';
import { PaymentHistoryInList } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import isNil from 'lodash.isnil';
import omitBy from 'lodash.omitby';
import { UpdateMode } from 'realm';

export function createPaymentHistoryInListFromAxios(
  payment: Payment,
  mode?: UpdateMode.Never | UpdateMode.All | UpdateMode.Modified | boolean,
) {
  const newData: Payment = omitBy(payment, isNil);

  realmRef.current?.create(
    PaymentHistoryInList.schema.name,
    {
      _id: newData.Id,
      ...newData,
    },
    mode,
  );
}
