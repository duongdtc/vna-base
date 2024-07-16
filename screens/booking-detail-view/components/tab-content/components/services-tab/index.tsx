import { Block, EmptyList } from '@vna-base/components';
import { selectViewingBookingVersion } from '@redux-selector';
import { Ancillary, Passenger } from '@services/axios/axios-data';
import { PassengerType } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemService } from './item-service';

export const ServicesTab = () => {
  const bookingDetail = useSelector(selectViewingBookingVersion);

  const passengers: Record<string, Passenger> = useMemo(() => {
    const tempPassenger: Record<string, Passenger> = {};
    bookingDetail?.Passengers?.forEach(psg => {
      tempPassenger[psg.Id!] = psg;
    });

    return tempPassenger;
  }, [bookingDetail?.Passengers]);

  const sortFollowingPassenger = (arr: Array<Ancillary & Passenger>) => {
    return arr.sort((a, b) => {
      let tempA = 1;
      let tempB = 1;
      switch (a.PaxType) {
        case PassengerType.ADT:
          tempA = 3;
          break;
        case PassengerType.CHD:
          tempA = 2;
          break;
      }

      switch (b.PaxType) {
        case PassengerType.ADT:
          tempB = 3;
          break;
        case PassengerType.CHD:
          tempB = 2;
          break;
      }

      return tempB - tempA;
    });
  };

  const _data = useMemo(() => {
    const [dataBaggage, dataPreSeat, dataOtherServices]: Array<
      Array<Ancillary & Passenger>
    > = [[], [], []];

    [...(bookingDetail?.Ancillaries ?? [])]
      .sort((a, b) => a.Index! - b.Index!)
      .forEach(service => {
        if (service.Type === 'BAGGAGE') {
          dataBaggage.push({ ...service, ...passengers[service.PassengerId!] });
          return;
        }

        if (service.Type === 'PRESEAT') {
          dataPreSeat.push({ ...service, ...passengers[service.PassengerId!] });
          return;
        }

        dataOtherServices.push({
          ...service,
          ...passengers[service.PassengerId!],
        });
      });

    return {
      dataBaggage: sortFollowingPassenger(dataBaggage),
      dataPreSeat: sortFollowingPassenger(dataPreSeat),
      dataOtherServices: sortFollowingPassenger(dataOtherServices),
    };
  }, [bookingDetail?.Ancillaries, passengers]);

  return (
    <Block flex={1}>
      {isEmpty(_data.dataBaggage) &&
      isEmpty(_data.dataPreSeat) &&
      isEmpty(_data.dataOtherServices) ? (
        <EmptyList
          height={500}
          image="emptyListFlight"
          imageStyle={{ width: 192, height: 101 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 12,
          }}
          showsVerticalScrollIndicator={false}>
          <ItemService
            dataService={_data.dataBaggage}
            titleT18n="booking:baggage"
          />
          <ItemService
            dataService={_data.dataPreSeat}
            titleT18n="booking:prevSeat"
          />
          <ItemService
            dataService={_data.dataOtherServices}
            titleT18n="booking:other"
          />
        </ScrollView>
      )}
    </Block>
  );
};
