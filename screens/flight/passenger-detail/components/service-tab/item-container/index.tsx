/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-nested-ternary */

import { Block, Icon, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { Seat } from '@services/axios/axios-ibe';
import { createStyleSheet, useStyles } from '@theme';
import { ActiveOpacity, scale, getFullNameOfPassenger } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { ItemContainerProps } from '../type';
import { FlightItem } from './flight-item';
import { APP_SCREEN } from '@utils';

export const ItemContainer = (props: ItemContainerProps) => {
  const {
    t18nTitle,
    renderSegment = true,
    defaultClose = false,
    disabled = false,
    t18nEmpty,
    loading = false,
    services,
    renderServiceItem,
  } = props;

  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const { control, getValues, setValue } = useFormContext<PassengerForm>();
  const [isClose, setIsClose] = useState<boolean>(defaultClose);

  const flights = useWatch({
    control,
    name: 'FLights',
  });

  const onPickPreSeatDone = useCallback(
    (flIndex: number, segmentIndex: number) =>
      (seats: Array<Seat | undefined | null>) => {
        seats?.forEach((_seats, index) => {
          setValue(
            `Passengers.${index}.PreSeats.${flIndex}.${segmentIndex}`,
            _seats,
          );
        });
      },
    [setValue],
  );

  const onPressPreSeat = useCallback(
    (flightIdx: number, segmentIdx: number) => {
      const { Passengers: passengerData, SplitFullName } = getValues();
      const initData = passengerData
        .filter(passenger => passenger.Type !== 'INF')
        ?.map(
          passenger => passenger?.PreSeats[flightIdx ?? 0]?.[segmentIdx ?? 0],
        );

      navigate(APP_SCREEN.SELECT_SEAT, {
        passengers: passengerData
          .filter(passenger => passenger.Type !== 'INF')
          .map(passenger => ({
            ...passenger,
            FullName: SplitFullName
              ? getFullNameOfPassenger(passenger)
              : passenger.FullName,
          })),
        flightIndex: flightIdx ?? 0,
        initData: initData,
        initPassengerIndex: 0,
        segment: {
          ...getValues().FLights[flightIdx ?? 0].ListSegment![segmentIdx ?? 0],
          index: segmentIdx ?? 0,
        },
        onSubmit: onPickPreSeatDone(flightIdx, segmentIdx),
      });
    },
    [getValues, onPickPreSeatDone],
  );

  const _renderServiceItem = useCallback(
    (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex?: number | undefined;
    }) => renderServiceItem({ ...data, isOneway: flights.length !== 1 }),
    [flights.length, renderServiceItem],
  );

  const toggleContent = useCallback(() => {
    if (
      flights.length === 1 &&
      flights[0].ListSegment?.length === 1 &&
      t18nTitle === 'choose_services:choose_seat' &&
      !disabled &&
      !loading
    ) {
      onPressPreSeat(0, 0);
      setIsClose(false);
    } else {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 160,
      });
      setIsClose(prev => !prev);
    }
  }, [disabled, flights, loading, onPressPreSeat, t18nTitle]);

  const renderFlight = useCallback<ListRenderItem<FlightOfPassengerForm>>(
    ({ item, index }) => (
      <FlightItem
        {...item}
        index={index}
        renderSegment={renderSegment}
        hideHeader={flights.length === 1 && item.ListSegment?.length === 1}
        isEmptyService={isEmpty(services![index])}
        onPressSegmentPreSeat={
          t18nTitle === 'choose_services:choose_seat' ? onPressPreSeat : null
        }
        renderServiceItem={_renderServiceItem}
        t18nEmpty={t18nEmpty}
      />
    ),
    [
      _renderServiceItem,
      flights.length,
      onPressPreSeat,
      renderSegment,
      services,
      t18nEmpty,
      t18nTitle,
    ],
  );

  return (
    <Block borderRadius={8} colorTheme="neutral100">
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={toggleContent}
        style={[
          styles.btnItemService,
          !isClose &&
            flights.length === 1 &&
            flights[0].ListSegment?.length === 1 && { paddingBottom: 0 },
        ]}>
        <Text fontStyle="Body16Semi" colorTheme="neutral100" t18n={t18nTitle} />
        <Icon
          icon={isClose ? 'arrow_ios_right_fill' : 'arrow_ios_down_fill'}
          size={24}
          colorTheme="neutral100"
        />
      </TouchableOpacity>
      <Block
        height={isClose ? 0 : 'auto'}
        overflow="hidden"
        borderColorTheme="neutral100"
        paddingHorizontal={12}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.neutral80}
            style={{ marginVertical: scale(12) }}
          />
        ) : disabled ? (
          <Text
            t18n={t18nEmpty}
            textAlign="center"
            fontStyle="Body16Reg"
            colorTheme="neutral70"
            style={{ marginVertical: scale(12) }}
          />
        ) : (
          <FlatList
            data={flights}
            renderItem={renderFlight}
            scrollEnabled={false}
            keyExtractor={(_, index) => index.toString()}
          />
        )}
      </Block>
    </Block>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  btnItemService: {
    borderRadius: spacings[8],
    padding: spacings[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
