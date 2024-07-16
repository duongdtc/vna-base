import { Block, Text } from '@vna-base/components';
import {
  Flight,
  FlightChangeForm,
} from '@vna-base/screens/booking-actions/flight-change-detail/type';
import React, { useCallback } from 'react';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { FlightItem } from '../flight-item';
import { useSelector } from 'react-redux';
import { System } from '@vna-base/utils';
import { selectCurrentFeature } from '@redux-selector';
import { realmRef } from '@services/realm/provider';
import { BookingRealm } from '@services/realm/models/booking';

export const ListOldFlight = () =>
  //   {
  //   bottomSheetRef,
  // }: {
  //   bottomSheetRef: React.RefObject<BottomSheetContentFlightRef>;
  // }
  {
    const { bookingId } = useSelector(selectCurrentFeature);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const system = realmRef.current?.objectForPrimaryKey<BookingRealm>(
      BookingRealm.schema.name,
      bookingId,
    )!.System;

    const { control, getValues } = useFormContext<FlightChangeForm>();

    const { fields, update } = useFieldArray({
      control,
      name: 'oldFlights',
    });

    // const onPressItem = useCallback(
    //   (flight: Flight, index: number) => {
    //     // map flight to AirlineOptionCustom
    //     const data: AirOptionCustom = {
    //       ...flight,
    //       ListFareOption: [flight.FareOption!],
    //       OptionId: flight.AirlineOptionId,
    //       ListFlightOption: [
    //         { OptionId: flight.FlightOptionId, ListFlight: [flight] },
    //       ],
    //       selected: true,
    //     };

    //     bottomSheetRef.current?.expand({
    //       airOption: data,
    //       fareType: 'TotalFare',
    //       indexs: {
    //         stageIndex: index,
    //         flightOptionIndex: 0,
    //       },
    //     });
    //   },
    //   [bottomSheetRef],
    // );

    const onPressSecondOption = useCallback(
      (index: number, item: Flight) => {
        if (system === System.VJ) {
          const selectedIdx = getValues().oldFlights.findIndex(
            fl => fl.isSelected,
          );

          if (selectedIdx !== -1) {
            update(selectedIdx, { ...item, isSelected: false });
          }
        }

        update(index, { ...item, isSelected: !item.isSelected });
      },
      [update],
    );

    const _renderItemFlight = useCallback<
      ListRenderItem<FieldArrayWithId<FlightChangeForm, 'oldFlights', 'id'>>
    >(
      ({ index }) => (
        <FlightItem
          // onPressItem={onPressItem}
          onPressSecondOption={onPressSecondOption}
          index={index}
          name={`oldFlights.${index}`}
          isOld={true}
          useRadioButton={system === System.VJ}
        />
      ),
      [onPressSecondOption],
    );

    return (
      <Block rowGap={8} paddingTop={8}>
        <Text
          t18n="flight_change_detail:select_old_flight"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
        <FlatList
          scrollEnabled={false}
          data={fields}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={_renderItemFlight}
          ItemSeparatorComponent={() => <Block height={12} />}
        />
      </Block>
    );
  };
