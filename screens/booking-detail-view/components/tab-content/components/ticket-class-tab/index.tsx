import { Block } from '@vna-base/components';
import { selectViewingBookingVersion } from '@redux-selector';
import { FareInfo } from '@services/axios/axios-data';
import { PassengerType } from '@vna-base/utils';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { InfoFareItem } from './info-fare-item';

export const TicketClassTab = () => {
  const bookingDetail = useSelector(selectViewingBookingVersion);

  const _data = useMemo(() => {
    const [dataAdtFare, dataChdFare, dataInfFare]: Array<Array<FareInfo>> = [
      [],
      [],
      [],
    ];

    bookingDetail?.FareInfos?.forEach(fare => {
      if (fare.PaxType === PassengerType.ADT) {
        dataAdtFare.push(fare);
        return;
      }

      if (fare.PaxType === PassengerType.CHD) {
        dataChdFare.push(fare);
        return;
      }

      dataInfFare.push(fare);
    });

    return {
      dataAdtFare,
      dataChdFare,
      dataInfFare,
    };
  }, [bookingDetail?.FareInfos]);

  return (
    <Block flex={1}>
      <ScrollView
        contentContainerStyle={{
          padding: 12,
        }}
        showsVerticalScrollIndicator={false}>
        <InfoFareItem dataFare={_data.dataAdtFare} titleT18n="flight:adult" />
        <InfoFareItem
          dataFare={_data.dataChdFare}
          titleT18n="flight:children"
        />
        <InfoFareItem dataFare={_data.dataInfFare} titleT18n="flight:infant" />
      </ScrollView>
    </Block>
  );
};
