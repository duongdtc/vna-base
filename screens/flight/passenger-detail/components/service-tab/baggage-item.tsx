import { Block, Icon, Text } from '@vna-base/components';
import { selectLanguage } from '@redux-selector';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { BaggageItemProps } from './type';
import { useWatchName } from '../../hooks';
import { useStyles, createStyleSheet } from '@theme';

export const BaggageItem = (props: BaggageItemProps) => {
  const { passengerIndex, flightIndex, isOneway, onPress } = props;

  const { control } = useFormContext<PassengerForm>();
  const { styles } = useStyles(styleSheet);
  const lng = useSelector(selectLanguage);

  const fullName = useWatchName(passengerIndex);

  const typePassenger = useWatch({
    control,
    name: `Passengers.${passengerIndex}.Type`,
  });

  const baggage = useWatch({
    control,
    name: `Passengers.${passengerIndex}.Baggages.${flightIndex}`,
  });

  const _baggageExist = useMemo(() => {
    if (typeof baggage === 'object' && !isEmpty(baggage)) {
      return true;
    }

    return false;
  }, [baggage]);

  if (typePassenger === 'INF') {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      style={[
        styles.servicePassengerItem,
        isOneway && {
          paddingHorizontal: scale(12),
        },
      ]}
      onPress={() => {
        onPress({
          passengerIndex,
          selected: baggage?.Value,
          flightIndex,
        });
      }}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Block
          flex={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text text={fullName} fontStyle="Body12Med" colorTheme="neutral100" />
          {_baggageExist ? (
            <Text
              text={lng === 'vi' ? 'Giá' : 'Price'}
              fontStyle="Body12Med"
              colorTheme="neutral100"
            />
          ) : null}
        </Block>
        {!_baggageExist && (
          <Block flexDirection="row" columnGap={4} alignItems="center">
            <Text
              t18n="input_info_passenger:select_baggage"
              fontStyle="Body12Reg"
              colorTheme="neutral80"
            />
            <Icon
              icon="arrow_ios_down_outline"
              size={16}
              colorTheme="neutral100"
            />
          </Block>
        )}
      </Block>
      {_baggageExist && (
        <Block
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Text
            text={baggage.Name as string}
            fontStyle="Body12Reg"
            colorTheme="neutral80"
          />
          <Text
            text={!baggage ? undefined : baggage.Price?.currencyFormat()}
            fontStyle="Body12Bold"
            colorTheme="price"
          />
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
