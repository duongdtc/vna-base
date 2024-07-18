/* eslint-disable react/no-unstable-nested-components */
import { bs, createStyleSheet, useStyles } from '@theme';
import { I18nKeys } from '@translations/locales';
import { images } from '@vna-base/assets/image';
import { Block, Icon, Text } from '@vna-base/components';
import { flightBookingFormActions } from '@vna-base/redux/action-slice';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { translate } from '@vna-base/translations/translate';
import { ActiveOpacity, dispatch, scale } from '@vna-base/utils';
import React, { useCallback, useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { Baggages } from './baggages';
import { Seats } from './seats';
import { Services } from './services';
import { ShuttleCars } from './shuttle-cars';
import { Hotels } from './hotels';

export interface Service {
  key:
    | 'SeatService'
    | 'BaggageService'
    | 'OthersService'
    | 'ShuttleBus'
    | 'Hotel';
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
  {
    key: 'ShuttleBus',
    t18nTitle: 'choose_services:shuttle_bus',
  },
  {
    key: 'Hotel',
    t18nTitle: 'choose_services:hotel',
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

      case 'ShuttleBus':
        return <ShuttleCars t18nTitle={item.t18nTitle} />;

      case 'Hotel':
        return <Hotels t18nTitle={item.t18nTitle} />;
    }
  }, []);

  const InsuranceTravel = useCallback(() => {
    return (
      <Controller
        control={control}
        name="Insurance"
        render={({ field: { value, onChange } }) => {
          return (
            <View style={styles.insuranceContainer}>
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                style={[bs.flexRowSpaceBetween]}
                onPress={() => onChange(!value)}>
                <View style={[bs.flex, bs.flexRowAlignCenter, bs.columnGap_8]}>
                  <Text
                    fontStyle="Title16Semi"
                    colorTheme="neutral100"
                    t18n="choose_services:insurance_travel"
                  />
                  <Image source={images.saladinImg} resizeMode="contain" />
                </View>
                <Icon
                  icon={
                    value ? 'checkmark_circle_2_fill' : 'radio_button_off_fill'
                  }
                  size={20}
                  colorTheme="success500"
                />
              </TouchableOpacity>
              <View style={styles.imageInsurance}>
                <Image source={images.insuranceImg} resizeMode="contain" />
              </View>
              <Text
                fontStyle="Body14Semi"
                colorTheme="neutral100"
                t18n="choose_services:des_insurance1"
              />
              <Text fontStyle="Body12Med" colorTheme="neutral100">
                {translate('choose_services:des_insurance2')}{' '}
                <Text
                  fontStyle="Body12Med"
                  colorTheme="neutral100"
                  t18n="choose_services:des_insurance3"
                />
              </Text>
              <View style={[bs.flexRowSpaceBetween]}>
                <View style={styles.detailInsurance}>
                  <Text
                    t18n="choose_services:detail"
                    fontStyle="Capture11Reg"
                    colorTheme="primaryPressed"
                  />
                  <Icon
                    icon="external_link_fill"
                    size={12}
                    colorTheme="primaryPressed"
                  />
                </View>
                <View>
                  <Text fontStyle="Title16Semi" colorTheme="price">
                    {'108,000'}{' '}
                    <Text
                      fontStyle="Title16Semi"
                      colorTheme="neutral100"
                      text="VND"
                    />
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    );
  }, [
    control,
    styles.detailInsurance,
    styles.imageInsurance,
    styles.insuranceContainer,
  ]);

  return (
    <FlatList
      data={serviceNames}
      keyExtractor={item => `${item.key}`}
      renderItem={_renderItemService}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      ItemSeparatorComponent={() => <Block height={12} />}
      ListFooterComponent={InsuranceTravel}
    />
  );
};

const styleSheet = createStyleSheet(({ spacings, colors, radius }) => ({
  contentContainer: {
    paddingTop: spacings[16],
    paddingHorizontal: spacings[12],
    paddingBottom: spacings[16],
  },
  insuranceContainer: {
    marginTop: spacings[12],
    backgroundColor: colors.white,
    borderRadius: radius[8],
    padding: spacings[12],
    rowGap: spacings[12],
  },
  imageInsurance: {
    width: '100%',
    height: scale(106),
    borderRadius: radius[8],
    overflow: 'hidden',
  },
  detailInsurance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacings[12],
    paddingVertical: spacings[6],
    backgroundColor: colors.neutral20,
    borderRadius: radius[8],
  },
}));
