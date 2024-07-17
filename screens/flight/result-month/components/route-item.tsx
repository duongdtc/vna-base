import {
  Block,
  Button,
  DateRangePickerMode,
  RangeDate,
  Text,
} from '@vna-base/components';
import { selectViewChart } from '@vna-base/redux/selector';
import { Route } from '@redux/type';
import { ColorLight } from '@theme/color';
import { translate } from '@vna-base/translations/translate';
import { ActiveOpacity, HitSlop, dispatch } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetResult } from '../hooks';
import { Calendar } from './calendar';
import { Chart } from './chart';
import {
  DetailMinPriceBottomSheet,
  DetailMinPriceBottomSheetRef,
} from './detail-min-price-bottom-sheet';
import { ModalMonthPicker } from '@vna-base/screens/flight/components';
import { ModalMonthPickerRef } from '@vna-base/screens/flight/type';
import { flightSearchActions } from '@vna-base/redux/action-slice';
import { MinPrice } from '@services/axios/axios-ibe';

export const RouteItem = memo(
  ({
    DepartDate,
    Leg,
    EndPoint,
    StartPoint,
    minDate,
    selectMinPrice,
  }: Route & {
    minDate: Date | null;
    selectMinPrice: (minPrice: MinPrice, leg: number) => void;
  }) => {
    const viewChart = useSelector(selectViewChart);
    const normalRef = useRef<DetailMinPriceBottomSheetRef>(null);
    const monthPickerRef = useRef<ModalMonthPickerRef>(null);

    const minPrices = useGetResult(Leg);

    const onPressDate = (index: number) => {
      normalRef.current?.present(index);
    };

    const handleDoneMonthPicker = (result: RangeDate) => {
      dispatch(flightSearchActions.searchFlightByMonth(Leg, result.from));
    };

    const showMonthPicker = () => {
      monthPickerRef.current?.present({
        initialValue: {
          from: DepartDate,
          to: undefined,
        },
        minDate: minDate ?? new Date(),
        t18nTitle: 'flight:select_date',
        mode: DateRangePickerMode.Single,
      });
    };

    const subMonth = () => {
      dispatch(
        flightSearchActions.searchFlightByMonth(
          Leg,
          dayjs(DepartDate).subtract(1, 'months').toDate(),
        ),
      );
    };

    const addMonth = () => {
      dispatch(
        flightSearchActions.searchFlightByMonth(
          Leg,
          dayjs(DepartDate).add(1, 'months').toDate(),
        ),
      );
    };

    const _selectMinPrice = (minPrice: MinPrice) => {
      selectMinPrice(minPrice, Leg);
    };

    const renderContent = () => {
      if (minPrices.length === 0) {
        return (
          <Block
            justifyContent="center"
            alignItems="center"
            height={270}
            colorTheme="neutral100">
            <ActivityIndicator size="large" color={ColorLight.primary500} />
          </Block>
        );
      }

      if (viewChart) {
        return <Chart minPrices={minPrices} onPressBar={onPressDate} />;
      }

      return <Calendar minPrices={minPrices} onPressDate={onPressDate} />;
    };

    return (
      <Block colorTheme="neutral100">
        <Block
          flexDirection="row"
          shadow="small"
          padding={12}
          zIndex={9}
          justifyContent="space-between"
          colorTheme="neutral100"
          alignItems="center">
          <Text
            fontStyle="Title16Semi"
            colorTheme="neutral900"
            text={`${translate('flight:stage')} ${StartPoint.Code} -> ${
              EndPoint.Code
            }`}
          />
          <Block flexDirection="row" alignSelf="center">
            <Button
              disabled={
                !dayjs(DepartDate).isAfter(minDate ?? new Date(), 'months')
              }
              onPress={subMonth}
              leftIcon="arrow_ios_left_outline"
              leftIconSize={20}
              textColorTheme="neutral900"
              padding={0}
              hitSlop={{ ...HitSlop.LargeInset, right: 0 }}
            />
            <TouchableOpacity
              hitSlop={{ ...HitSlop.LargeInset, right: 0, left: 0 }}
              activeOpacity={ActiveOpacity}
              onPress={showMonthPicker}>
              <Text
                style={{ width: 80 }}
                textAlign="center"
                fontStyle="Body14Semi"
                colorTheme="primary600"
                text={dayjs(DepartDate).format('MM/YYYY')}
              />
            </TouchableOpacity>
            <Button
              disabled={
                !dayjs(DepartDate).isBefore(dayjs().add(1, 'y'), 'months')
              }
              onPress={addMonth}
              leftIcon="arrow_ios_right_outline"
              leftIconSize={20}
              textColorTheme="neutral900"
              padding={0}
              hitSlop={{ ...HitSlop.LargeInset, left: 0 }}
            />
          </Block>
        </Block>
        {renderContent()}
        <DetailMinPriceBottomSheet
          ref={normalRef}
          minPrices={minPrices}
          selectMinPrice={_selectMinPrice}
        />
        <ModalMonthPicker
          ref={monthPickerRef}
          handleDone={handleDoneMonthPicker}
        />
      </Block>
    );
  },
  isEqual,
);
