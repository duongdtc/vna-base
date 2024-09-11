import { Block, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { APP_SCREEN } from '@utils';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { FlightChangeForm } from '../../type';
import { FlightItem } from '../flight-item';
import { save, StorageKey } from '@vna-base/utils';

export const ListNewFlight = () =>
  //   {
  //   bottomSheetRef,
  // }: {
  //   bottomSheetRef: React.RefObject<BottomSheetContentFlightRef>;
  // }
  {
    const { control } = useFormContext<FlightChangeForm>();

    const { fields } = useFieldArray({
      control,
      name: 'newFlights',
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

    const onPressSecondOption = useCallback((index: number) => {
      navigate(APP_SCREEN.RESULT_SEARCH_FLIGHT, {
        selectedIndex: index,
        hideBookingSystems: true,
        hidePassengers: true,
        screenWhenDone: APP_SCREEN.FLIGHT_CHANGE_DETAIL,
      });
    }, []);

    const _renderItemFlight = useCallback<
      ListRenderItem<FieldArrayWithId<FlightChangeForm, 'newFlights', 'id'>>
    >(
      ({ index }) => (
        <FlightItem
          // onPressItem={onPressItem}
          onPressSecondOption={onPressSecondOption}
          index={index}
          name={`newFlights.${index}`}
        />
      ),
      [onPressSecondOption],
    );

    return (
      <Block rowGap={8} paddingTop={8}>
        <Text
          t18n="flight_change_detail:selected_new_flight"
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
