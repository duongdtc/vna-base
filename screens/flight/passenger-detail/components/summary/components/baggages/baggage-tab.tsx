/* eslint-disable @typescript-eslint/ban-ts-comment */
import { images } from '@assets/image';
import { Block, Image, Text } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { FlightOfPassengerForm, PassengerForm } from '@vna-base/screens/flight/type';
import { Ancillary } from '@services/axios/axios-ibe';
import { scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { ListRenderItem } from 'react-native';
import { FlightContainerItem } from '../flight-container-item';
import { BaggageItem } from './baggage-item';

const renderItem = (data: { passengerIndex: number; flightIndex: number }) => {
  return <BaggageItem {...data} />;
};

export const BaggageTab = () => {
  const { control } = useFormContext<PassengerForm>();

  const flights = useWatch({
    control,
    name: 'FLights',
  });

  const { fields } = useFieldArray({
    control,
    name: 'Passengers',
  });

  const arrayName = useMemo(() => {
    return fields.map((_, indx) => `Passengers.${indx}.Baggages`);
  }, [fields]);

  //@ts-ignore
  const baggages: Array<Array<Ancillary>> = useWatch({
    control,
    //@ts-ignore
    name: arrayName,
  });

  const isShow = useMemo(
    () =>
      baggages.findIndex(
        baggage =>
          baggage.findIndex(bagOfSegment => !isEmpty(bagOfSegment)) !== -1,
      ) !== -1,
    [baggages],
  );

  const renderFlight = useCallback<ListRenderItem<FlightOfPassengerForm>>(
    ({ item, index: flightIndex }) => {
      return (
        <FlightContainerItem
          item={item}
          typeService="Baggages"
          flightIndex={flightIndex}
          renderItem={renderItem}
        />
      );
    },
    [],
  );

  if (!isShow) {
    return (
      <Block flex={1} justifyContent="center" alignItems="center">
        <Image
          source={images.baggage}
          style={{ width: scale(100), height: scale(100) }}
          resizeMode="cover"
        />
        <Text
          fontStyle="Body16Semi"
          colorTheme="primaryColor"
          t18n="input_info_passenger:not_buy_baggage"
          style={{ marginTop: scale(12) }}
        />
        <Text
          fontStyle="Body12Reg"
          colorTheme="neutral60"
          t18n="input_info_passenger:sub_not_buy_baggage"
        />
      </Block>
    );
  }

  return (
    <BottomSheetFlatList
      data={flights}
      renderItem={renderFlight}
      keyExtractor={(_, index) => index.toString()}
      ItemSeparatorComponent={() => <Block height={12} />}
      contentContainerStyle={{ padding: 12 }}
    />
  );
};
