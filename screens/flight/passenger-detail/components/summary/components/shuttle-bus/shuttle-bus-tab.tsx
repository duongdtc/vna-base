/* eslint-disable @typescript-eslint/ban-ts-comment */
import { images } from '@assets/image';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { useStyles } from '@theme';
import { Block, Image, Separator, Text } from '@vna-base/components';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { scale } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ListRenderItem, View } from 'react-native';
import {
  Bus,
  BusDetails,
} from '../../../service-tab/shuttle-cars/components/shuttle-car-item/dummy';

export const ShuttleBusTab = () => {
  const { control } = useFormContext<PassengerForm>();

  const shuttleBus = useWatch({
    control,
    name: 'ShuttleBuses',
  });

  console.log('shuttleBus', shuttleBus);

  const flights = useWatch({
    control,
    name: 'FLights',
  });

  flights.forEach((flight, flightIndex) => {
    flight.ListSegment = flight.ListSegment?.map((segment, segmentIndex) => {
      // Tính chỉ số cho mảng types dựa vào flightIndex và segmentIndex
      const typeIndex = (flightIndex + segmentIndex) % shuttleBus.length;
      return {
        ...segment,
        type: shuttleBus[typeIndex].type,
      };
    });
  });

  const renderItem = useCallback<ListRenderItem<FlightOfPassengerForm>>(
    ({ item, index }) => {
      const airportSP = realmRef.current?.objectForPrimaryKey<AirportRealm>(
        AirportRealm.schema.name,
        item.StartPoint as string,
      );

      const car = Object.values(BusDetails).find(
        //@ts-ignore
        it => it.key === item?.ListSegment?.[0]?.type,
      );

      return (
        <Block
          colorTheme="neutral100"
          borderRadius={8}
          overflow="hidden"
          padding={12}
          rowGap={12}>
          <View>
            <Text
              text={`${index + 1}. ${airportSP?.NameVi}`}
              fontStyle="Body14Semi"
              colorTheme="neutral100"
            />
          </View>
          <Separator type="horizontal" size={3} />
          <Block
            paddingHorizontal={4}
            rowGap={4}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Block>
              <Text
                text="Loại xe"
                fontStyle="Body14Med"
                colorTheme="neutral100"
              />
              <Text
                text={car?.t18n}
                fontStyle="Body12Bold"
                colorTheme={'success500'}
              />
            </Block>
            <Block>
              <Text
                text={'Giá'}
                fontStyle="Body14Med"
                colorTheme={'neutral100'}
              />
              <Text
                text={car?.price?.currencyFormat()}
                fontStyle="Body12Bold"
                colorTheme={'price'}
              />
            </Block>
          </Block>
        </Block>
      );
    },
    [],
  );

  if (
    shuttleBus.every(it => it.type === undefined) ||
    shuttleBus.every(it => it.type === Bus.ZERO)
  ) {
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
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      ItemSeparatorComponent={() => <Block height={12} />}
      contentContainerStyle={{ padding: 12 }}
    />
  );
};
