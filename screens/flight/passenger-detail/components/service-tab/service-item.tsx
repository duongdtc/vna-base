import { Block, Icon, Separator, Text } from '@vna-base/components';
import { selectLanguage } from '@vna-base/redux/selector';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useWatchName } from '../../hooks';
import { bs, createStyleSheet, useStyles } from '@theme';
import { ServiceItemProps } from './type';

export const ServiceItem = (props: ServiceItemProps) => {
  const { styles } = useStyles(styleSheet);
  const { passengerIndex, flightIndex, segmentIndex, isOneway, onPress } =
    props;

  const { control, getValues } = useFormContext<PassengerForm>();
  const lng = useSelector(selectLanguage);

  const fullName = useWatchName(passengerIndex);

  const typePassenger = useWatch({
    control,
    name: `Passengers.${passengerIndex}.Type`,
  });

  const services = useWatch({
    control,
    name: `Passengers.${passengerIndex}.Services.${flightIndex}.${segmentIndex}`,
  });

  const _onPress = () => {
    onPress({
      passengerIndex,
      listSelected: services?.map(service => service.Value as string),
      flight: { ...getValues().FLights[flightIndex], index: flightIndex },
      segmentIndex,
    });
  };

  if (typePassenger === 'INF') {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      style={[
        styles.servicePassengerItem,
        isOneway && {
          paddingHorizontal: 12,
        },
      ]}
      onPress={_onPress}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Text text={fullName} fontStyle="Body12Med" colorTheme="neutral100" />
        {!services || services.length === 0 ? (
          <Block flexDirection="row" columnGap={4} alignItems="center">
            <Text
              t18n="input_info_passenger:select_service"
              fontStyle="Body12Reg"
              colorTheme="neutral80"
            />
            <Icon
              icon="arrow_ios_down_outline"
              size={16}
              colorTheme="neutral100"
            />
          </Block>
        ) : (
          <Text
            text={lng === 'vi' ? 'Giá' : 'Price'}
            fontStyle="Body12Med"
            colorTheme="neutral100"
          />
        )}
      </Block>
      {services && services.length > 0 && (
        <Block>
          {services.map((service, index) => (
            <Block key={service.Value}>
              {index !== 0 && (
                <View style={(bs.marginVertical_4, bs.paddingHorizontal_4)}>
                  <Separator
                    size={2}
                    type="horizontal"
                    colorTheme="neutral50"
                  />
                </View>
              )}
              <Block
                flex={1}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <Block
                  flex={8}
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="flex-start">
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    text={service.Name as string}
                    fontStyle="Body12Reg"
                    colorTheme="neutral80"
                  />
                </Block>
                <Block
                  flex={2}
                  flexDirection="row"
                  justifyContent="flex-end"
                  alignItems="center">
                  <Text
                    text={service.Price?.currencyFormat()}
                    fontStyle="Body12Bold"
                    colorTheme="price"
                  />
                </Block>
              </Block>
            </Block>
          ))}
        </Block>
      )}
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  servicePassengerItem: {
    paddingVertical: spacings[12],
  },
}));
