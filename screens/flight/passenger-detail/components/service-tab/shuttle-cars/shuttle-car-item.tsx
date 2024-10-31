import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, Text } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { ShuttleCarItemProps } from '../type';

export const ShuttleCarItem = (props: ShuttleCarItemProps) => {
  const { flightIndex, onPress, airportIdx } = props;

  const { control } = useFormContext<PassengerForm>();
  const { styles } = useStyles(styleSheet);

  const car = useWatch({
    control,
    name: `ShuttleCars.${flightIndex}.${airportIdx}`,
  });

  const _exist = useMemo(() => {
    if (typeof car === 'object' && !isEmpty(car) && car.price !== undefined) {
      return true;
    }

    return false;
  }, [car]);

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      style={[styles.servicePassengerItem]}
      onPress={() => {
        onPress({
          selected: car?.value,
          flightIndex,
          airportIdx,
        });
      }}>
      <Block rowGap={4}>
        <Block flexDirection="row" columnGap={2} alignItems="center">
          <Block flex={1}>
            <Text
              text="Loại xe"
              fontStyle="Body14Med"
              colorTheme="neutral100"
            />
          </Block>
          {_exist ? (
            <Text text="Giá" fontStyle="Body14Reg" colorTheme="neutral100" />
          ) : (
            <>
              <Text
                text="Chưa chọn"
                fontStyle="Body14Reg"
                colorTheme="neutral100"
              />
              <Icon
                icon="arrow_ios_down_outline"
                size={16}
                colorTheme="neutral100"
              />
            </>
          )}
        </Block>
        {_exist && (
          <Block
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Text
              text={car.title}
              fontStyle="Body12Bold"
              colorTheme="successColor"
            />
            <Text
              text={car.price?.currencyFormat()}
              fontStyle="Body12Bold"
              colorTheme="price"
            />
          </Block>
        )}
      </Block>
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  servicePassengerItem: {
    padding: spacings[12],
  },
}));
