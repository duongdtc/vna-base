/* eslint-disable react-native/no-unused-styles */
import { Block, Separator } from '@vna-base/components';
import {
  selectIsLoadingVerifiedFlights,
  selectListSelectedFlight,
  selectVerifiedFlights,
} from '@vna-base/redux/selector';
import { flightBookingFormActions } from '@vna-base/redux/action-slice';
import {
  AirOptionCustom,
  BottomSheetContentFlightRef,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { FlightFare } from '@services/axios/axios-ibe';
import { useTheme } from '@theme';
import { dispatch, scale } from '@vna-base/utils';
import React, { memo, useCallback, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FlightItem } from './flight-item';
import { Opacity } from '@theme/color';

export const ListFlight = memo(
  ({
    bottomSheetRef,
  }: {
    bottomSheetRef: React.RefObject<BottomSheetContentFlightRef>;
  }) => {
    const styles = useStyles();
    const { colors } = useTheme();
    const { getValues } = useFormContext<PassengerForm>();

    const verifiedFlights = useSelector(selectVerifiedFlights);
    const isLoadingverifiedFlights = useSelector(
      selectIsLoadingVerifiedFlights,
    );

    const listSelectedFlightInStore = useSelector(selectListSelectedFlight);

    const listFlight = (() => {
      if (verifiedFlights.length === 0 || isLoadingverifiedFlights) {
        return listSelectedFlightInStore.map(
          fl =>
            ({
              Itinerary: fl.Itinerary,
              ListFlight: fl.ListFlightOption![0].ListFlight,
              System: fl.System,
              Leg: fl.Leg,
              Journey: fl.Journey,
              Remark: fl.Remark,
              Airline: fl.Airline,
              FareInfo: fl.ListFareOption![0],
            } as FlightFare),
        );
      }

      return verifiedFlights;
    })();

    const onPressItem = (flight: FlightFare, index: number) => {
      const data: AirOptionCustom = {
        ...flight,
        ListFareOption: [flight.FareInfo!],
        // OptionId: 1,
        ListFlightOption: [{ OptionId: 1, ListFlight: flight.ListFlight }],
        selected: true,
        verifySession: flight.Session!,
      };

      bottomSheetRef.current?.expand({
        airOption: data,
        fareType: 'TotalFare',
        customFeeTotalType: (flight.Itinerary ?? 1) > 1 ? 'Total' : undefined,
        indexs: {
          stageIndex: index,
          flightOptionIndex: 0,
        },
      });
    };

    const saveForm = () => {
      const val = getValues();
      dispatch(
        flightBookingFormActions.savePassengerForm({
          Passengers: val.Passengers.map(passenger => ({
            ...passenger,
            Baggages: new Array(passenger.Baggages.length),
            Services: new Array(passenger.Services.length),
            PreSeats: new Array(passenger.PreSeats.length),
          })),
          ContactInfo: val.ContactInfo,
          SubmitOption: val.SubmitOption,
        }),
      );
    };

    const _renderItemFlight = useCallback<ListRenderItem<FlightFare>>(
      ({ item, index }) => (
        <FlightItem
          item={item}
          onPressItem={onPressItem}
          index={index}
          saveForm={saveForm}
        />
      ),
      [],
    );

    return (
      <Block style={styles.container}>
        <FlatList
          data={listFlight}
          scrollEnabled={false}
          keyExtractor={(item, index) => `${item.Leg}_${index}`}
          renderItem={_renderItemFlight}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => (
            <Separator
              type="horizontal"
              // paddingHorizontal={12}
              colorTheme="neutral20"
            />
          )}
        />
        {isLoadingverifiedFlights && (
          <Block style={styles.loadingContainer}>
            <ActivityIndicator color={colors.neutral800} size="small" />
          </Block>
        )}
      </Block>
    );
  },
  isEqual,
);

const useStyles = () => {
  const { colors, shadows } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          overflow: 'hidden',
          borderRadius: scale(8),
          backgroundColor: colors.neutral100,
          ...shadows.small,
        },
        loadingContainer: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.neutral100 + Opacity[80],
        },
      }),
    [colors.neutral100, shadows.small],
  );
};
