import { Block } from '@vna-base/components';
import { flightBookingFormActions } from '@redux-slice';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { I18nKeys } from '@translations/locales';
import { dispatch } from '@vna-base/utils';
import React, { useCallback, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FlatList } from 'react-native';
import { Baggages } from './baggages';
import { Seats } from './seats';
import { Services } from './services';
import { createStyleSheet, useStyles } from '@theme';

export interface Service {
  key: 'SeatService' | 'BaggageService' | 'OthersService';
  t18nTitle: I18nKeys;
}

export const serviceNames: Array<Service> = [
  {
    key: 'BaggageService',
    t18nTitle: 'choose_services:choose_baggage',
  },
  {
    key: 'OthersService',
    t18nTitle: 'choose_services:others_services',
  },
  {
    key: 'SeatService',
    t18nTitle: 'choose_services:choose_seat',
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
        return <Seats t18nTitle={item.t18nTitle} />;

      case 'BaggageService':
        return <Baggages t18nTitle={item.t18nTitle} />;

      case 'OthersService':
        return <Services t18nTitle={item.t18nTitle} />;
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

const styleSheet = createStyleSheet(({ spacings, colors }) => ({
  contentContainer: {
    paddingTop: spacings[16],
    paddingHorizontal: spacings[12],
    paddingBottom: spacings[16],
    backgroundColor: colors.neutral20,
  },
}));
