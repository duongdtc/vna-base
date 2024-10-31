/* eslint-disable react/no-unstable-nested-components */
import { IconTypes } from '@assets/icon';
import { createStyleSheet, useStyles } from '@theme';
import { I18nKeys } from '@translations/locales';
import { Block } from '@vna-base/components';
import { flightBookingFormActions } from '@vna-base/redux/action-slice';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { dispatch } from '@vna-base/utils';
import React, { useCallback, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FlatList } from 'react-native';
import { Baggages } from './baggages';
import { Beauty } from './beauty';
import { Drink } from './drink';
import { Entertainment } from './entertainment';
import { Food } from './food';
import { Hotels } from './hotels';
import { Insurances } from './insurances';
import { Seats } from './seats';
import { Services } from './services';
import { ShuttleCars } from './shuttle-cars';
import { WaitingRooms } from './waiting-rooms';

export interface Service {
  key:
    | 'SeatService'
    | 'BaggageService'
    | 'ShuttleCar'
    | 'Hotel'
    | 'WaitingRooms'
    | 'Insurance'
    | 'OthersService'
    | 'Food'
    | 'Drink'
    | 'Entertainment'
    | 'Beauty';
  t18nTitle: I18nKeys;
  icon?: IconTypes;
}

export const serviceNames: Array<Service> = [
  {
    key: 'BaggageService',
    t18nTitle: 'choose_services:choose_baggage',
    icon: 'suitcase_fill',
  },
  {
    key: 'SeatService',
    t18nTitle: 'choose_services:choose_seat',
    icon: 'flight_seat_fill',
  },
  {
    key: 'WaitingRooms',
    t18nTitle: 'choose_services:choose_waiting_room',
    icon: 'waitingroom',
  },
  {
    key: 'ShuttleCar',
    t18nTitle: 'choose_services:shuttle_bus',
    icon: 'car',
  },
  {
    key: 'Hotel',
    t18nTitle: 'choose_services:hotel',
    icon: 'bed',
  },
  {
    key: 'Insurance',
    t18nTitle: 'Bảo hiểm du lịch',
  },
  {
    key: 'Food',
    t18nTitle: 'Suất ăn',
    icon: 'eat_fill',
  },
  {
    key: 'Drink',
    t18nTitle: 'Đồ uống',
    icon: 'cup_fill',
  },
  {
    key: 'Beauty',
    t18nTitle: 'Làm đẹp',
    icon: 'brush_fill',
  },
  {
    key: 'Entertainment',
    t18nTitle: 'Giải trí',
    icon: 'music_fill',
  },
  {
    key: 'OthersService',
    t18nTitle: 'Dịch vụ khác',
    icon: 'grid_fill',
  },
];

export const ServiceTab = () => {
  const { styles } = useStyles(styleSheet);
  const { control } = useFormContext<PassengerForm>();

  const flights = useWatch({
    control,
    name: 'FLights',
  });

  useEffect(() => {
    if (flights[0]?.verified) {
      dispatch(flightBookingFormActions.getAncillaries(flights));
      dispatch(flightBookingFormActions.getSeatMaps(flights));
    }
  }, [flights]);

  const _renderItemService = useCallback(({ item }: { item: Service }) => {
    switch (item.key) {
      case 'SeatService':
        return <Seats t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'BaggageService':
        return <Baggages t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'WaitingRooms':
        return <WaitingRooms t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'OthersService':
        return <Services t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'ShuttleCar':
        return <ShuttleCars t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'Hotel':
        return <Hotels t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'Insurance':
        return <Insurances />;

      case 'Food':
        return <Food t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'Drink':
        return <Drink t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'Beauty':
        return <Beauty t18nTitle={item.t18nTitle} icon={item.icon} />;

      case 'Entertainment':
        return <Entertainment t18nTitle={item.t18nTitle} icon={item.icon} />;
    }
  }, []);

  return (
    <FlatList
      data={serviceNames}
      keyExtractor={item => `${item.key}`}
      renderItem={_renderItemService}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      ItemSeparatorComponent={() => <Block height={12} />}
    />
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  contentContainer: {
    paddingTop: spacings[16],
    paddingHorizontal: spacings[12],
    paddingBottom: spacings[16],
  },
}));
