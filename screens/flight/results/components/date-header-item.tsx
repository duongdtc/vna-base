import { Text } from '@vna-base/components';
import { selectCustomFeeTotal, selectLanguage } from '@redux-selector';
import { flightSearchActions } from '@redux-slice';
import { FareFilter } from '@vna-base/screens/flight/type';
import { bs, createStyleSheet, useStyles } from '@theme';
import { dispatch, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React, { memo, useCallback, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

export const DateHeaderItem = memo(
  ({
    date,
    fare,
    minDate,
    index,
  }: {
    date: Date;
    minDate: dayjs.Dayjs;
    index: number;
    fare: FareFilter;
  }) => {
    const { styles } = useStyles(styleSheet);

    const Lng = useSelector(selectLanguage);
    const { TotalFare } = useSelector(selectCustomFeeTotal);

    const onPressDate = useCallback((d: Date) => {
      dispatch(flightSearchActions.searchFlights(undefined, d));
    }, []);

    const _renderDateFormat = () => {
      switch (Lng) {
        case 'en':
          return `${dayjs(date).locale('en').format('ddd, D MMM')}`;

        default:
          return `${dayjs(date).locale('vi').format('ddd, D/M/YYYY')}`;
      }
    };

    const isCenter = index === 3;
    const isExpired = minDate.isAfter(dayjs(date), 'days');
    const fareValue = useMemo(() => {
      if (isEmpty(fare)) {
        return null;
      }

      return fare.TotalFare + TotalFare;
    }, [TotalFare, fare]);

    return (
      <TouchableOpacity
        onPress={() => {
          onPressDate(date);
        }}
        disabled={isCenter || isExpired}
        style={[
          styles.itemContainer,
          isCenter && styles.centerItem,
          isExpired && {
            opacity: 0.4,
          },
        ]}>
        <Text
          colorTheme={'white'}
          fontStyle="Body12Reg"
          text={_renderDateFormat()}
        />
        <View>
          {fareValue === null ? (
            <View
              style={[
                bs.borderRadius_8,
                bs.height_16,
                {
                  transform: [
                    {
                      scale: 0.6,
                    },
                  ],
                },
              ]}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Text
              colorTheme={'white'}
              fontStyle="Body12Semi"
              text={
                fareValue === undefined ? 'N/A' : fareValue.currencyFormat()
              }
            />
          )}
        </View>
      </TouchableOpacity>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, radius, spacings }) => ({
  itemContainer: {
    paddingVertical: spacings[6],
    paddingHorizontal: spacings[12],
    alignItems: 'center',
    width: scale(114),
    borderRadius: radius[4],
    rowGap: spacings[2],
  },
  centerItem: {
    backgroundColor: colors.primaryPressed,
  },
}));
