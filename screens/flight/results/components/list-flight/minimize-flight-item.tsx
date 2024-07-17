/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { selectCustomFeeTotal, selectFareType } from '@vna-base/redux/selector';
import { FlightItemProps } from '@vna-base/screens/flight/type';
import {
  ActiveOpacity,
  HitSlop,
  System,
  SystemDetails,
  getDateTimeOfFlightOption,
  getFareFromFareOption,
  scale,
} from '@vna-base/utils';
import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { bs, createStyleSheet, useStyles } from '@theme';

export const MinimizeFlightItem = ({
  item,
  style,
  onPressItem,
  onSelectItem,
}: FlightItemProps) => {
  const { styles } = useStyles(styleSheet);

  const customFeeTotal = useSelector(selectCustomFeeTotal);
  const fareType = useSelector(selectFareType);

  const departDate = item.ListFlightOption![0].ListFlight![0]
    .DepartDate as string;
  const arriveDate = item.ListFlightOption![0].ListFlight![0]
    .ArriveDate as string;

  const fare = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      getFareFromFareOption(item.ListFareOption![0]).ADT[fareType] +
      customFeeTotal[fareType!],
    [item.ListFareOption, fareType, customFeeTotal],
  );

  const selectFare = useCallback(() => {
    onSelectItem?.(item, 0, 0);
  }, [item, onSelectItem]);

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={() => onPressItem(item, 0)}
      style={style}>
      <View style={styles.imgContainer}>
        <View style={styles.img}>
          <SvgUri
            width={24}
            height={24}
            uri={LOGO_URL + item.Airline + '.svg'}
          />
        </View>
        <View style={styles.dateTimeFlContainer}>
          <Text
            colorTheme="neutral100"
            fontStyle="Body12Bold"
            text={getDateTimeOfFlightOption(departDate)?.time}
          />
          <Text colorTheme="neutral100" fontStyle="Body12Med" text="-" />
          <Text
            colorTheme="neutral100"
            fontStyle="Body12Bold"
            text={getDateTimeOfFlightOption(arriveDate)?.time}
          />
        </View>
        <Icon icon="info_outline" size={12} colorTheme="primaryColor" />
      </View>
      <View style={[bs.columnGap_8, styles.flexRowCenter]}>
        <View
          style={
            (styles.flexRowCenter,
            { width: scale(108), justifyContent: 'space-between' })
          }>
          <View
            style={[
              bs.paddingVertical_2,
              bs.paddingHorizontal_4,
              bs.borderRadius_2,
              {
                backgroundColor:
                  SystemDetails[item.System as System]?.colorTheme,
                overflow: 'hidden',
              },
            ]}>
            <Text
              text={item.System as string}
              fontStyle="Body10Semi"
              colorTheme="white"
              textAlign="center"
            />
          </View>
          <View style={[bs.columnGap_4, styles.flexRowCenter]}>
            <Text
              fontStyle="Body12Bold"
              colorTheme="price"
              text={Number(fare).currencyFormat()}
            />
            <Icon
              icon="arrow_ios_down_fill"
              size={12}
              colorTheme="neutral100"
            />
          </View>
        </View>
        <TouchableOpacity
          hitSlop={HitSlop.Large}
          activeOpacity={ActiveOpacity}
          onPress={selectFare}
          style={styles.btnChooseMinimize}>
          <Text
            colorTheme="neutral100"
            t18n="flight:choose_fare"
            fontStyle="Body14Semi"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  btnChoose: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 4,
  },
  btnChooseMinimize: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  imgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(8),
  },
  img: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  dateTimeFlContainer: {
    width: scale(85),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
