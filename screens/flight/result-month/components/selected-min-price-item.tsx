/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Icon, Text } from '@vna-base/components';
import { MinPrice } from '@services/axios/axios-ibe';
import { ActiveOpacity, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export const SelectedMinPricesItem = ({
  DepartDate,
  ListFlightFare,
  Leg,
  reselectMinPrice,
}: MinPrice & { Leg: number; reselectMinPrice: (leg: number) => void }) => {
  return (
    <Block
      borderRadius={8}
      paddingVertical={8}
      paddingHorizontal={12}
      borderWidth={10}
      borderColorTheme="success600"
      colorTheme="neutral100"
      rowGap={4}>
      <Text
        text={`${ListFlightFare![0].ListFlight![0].StartPoint} -> ${
          ListFlightFare![0].ListFlight![0].EndPoint
        }`}
        fontStyle="Title16Semi"
        colorTheme="neutral900"
      />
      <Text
        text={dayjs(DepartDate)
          .format('dddd, DD/MM/YYYY')
          .upperCaseFirstLetter()}
        fontStyle="Body14Semi"
        colorTheme="primary600"
      />
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        style={styles.container}
        onPress={() => {
          reselectMinPrice(Leg);
        }}>
        <Icon icon="refresh_fill" colorTheme="success500" size={20} />
        <Text
          colorTheme="success500"
          fontStyle="Title16Bold"
          t18n="common:reselect"
        />
      </TouchableOpacity>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(4),
  },
});
