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
import { ServiceItem } from './service-item';

export const ServiceTab = () => {
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
    return fields.map((_, indx) => `Passengers.${indx}.Services`);
  }, [fields]);

  //@ts-ignore
  const services: Array<Array<Ancillary[]>> = useWatch({
    control,
    //@ts-ignore
    name: arrayName,
  });

  const isShow = useMemo(
    () =>
      services?.findIndex(
        servicesOfPassenger =>
          servicesOfPassenger?.findIndex(
            servicesOfFlight =>
              servicesOfFlight?.findIndex(
                serviceOfSegment => !isEmpty(serviceOfSegment),
              ) !== -1,
          ) !== -1,
      ) !== -1,
    [services],
  );

  const renderItem = useCallback(
    (data: { passengerIndex: number; flightIndex: number }) => (
      <ServiceItem {...data} />
    ),
    [],
  );

  const renderFlight = useCallback<ListRenderItem<FlightOfPassengerForm>>(
    ({ item, index: flightIndex }) => {
      return (
        <FlightContainerItem
          item={item}
          typeService="Services"
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
          source={images.img_other_service}
          style={{ width: scale(100), height: scale(100) }}
          resizeMode="contain"
        />
        <Text
          fontStyle="Body16Semi"
          colorTheme="primaryColor"
          t18n="input_info_passenger:not_others_services"
          style={{ marginTop: scale(12) }}
        />
        <Text
          fontStyle="Body12Reg"
          colorTheme="neutral60"
          t18n="input_info_passenger:sub_not_others_services"
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
