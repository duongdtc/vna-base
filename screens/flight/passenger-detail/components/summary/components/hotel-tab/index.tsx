/* eslint-disable @typescript-eslint/ban-ts-comment */
import { images } from '@assets/image';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { Block, Icon, Image, Separator, Text } from '@vna-base/components';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { scale } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ListRenderItem, View } from 'react-native';

export const HotelTab = () => {
  const { control } = useFormContext<PassengerForm>();

  const hotels = useWatch({
    control,
    name: 'Hotels',
  });

  const flights = useWatch({
    control,
    name: 'FLights',
  });

  flights.forEach((flight, flightIndex) => {
    flight.ListSegment = flight.ListSegment?.map((segment, segmentIndex) => {
      const typeIndex = flightIndex + segmentIndex;
      return {
        ...segment,
        infoHotel: hotels?.[typeIndex] ?? undefined,
      };
    });
  });

  //   console.log('flights', JSON.stringify(flights));

  const renderItem = useCallback<ListRenderItem<FlightOfPassengerForm>>(
    //@ts-ignore
    ({ item, index }) => {
      const airportSP = realmRef.current?.objectForPrimaryKey<AirportRealm>(
        AirportRealm.schema.name,
        item.StartPoint as string,
      );

      const isShow =
        //@ts-ignore
        item?.ListSegment?.[0]?.infoHotel?.hotel !== undefined &&
        //@ts-ignore
        item?.ListSegment?.[0]?.infoHotel?.hotel !== null;

      return (
        isShow && (
          <Block
            colorTheme="neutral100"
            borderRadius={8}
            overflow="hidden"
            padding={12}
            rowGap={12}>
            <View>
              <Text
                text={`${index + 1}. ${airportSP?.City.NameVi}`}
                fontStyle="Body14Semi"
                colorTheme="neutral100"
              />
            </View>
            <Separator type="horizontal" size={3} />
            <Block rowGap={4}>
              <Block
                paddingHorizontal={4}
                rowGap={4}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Block>
                  <Text
                    text="Loại phòng"
                    fontStyle="Body14Med"
                    colorTheme="neutral100"
                  />
                  <Text
                    //@ts-ignore
                    text={item?.ListSegment?.[0]?.infoHotel?.room?.t18n}
                    fontStyle="Body12Bold"
                    colorTheme={'success500'}
                  />
                </Block>
                <Block alignItems="flex-end">
                  <Text
                    text={'Giá'}
                    fontStyle="Body14Med"
                    colorTheme={'neutral100'}
                  />
                  <Text
                    //@ts-ignore
                    text={item?.ListSegment?.[0]?.infoHotel?.room?.price?.currencyFormat()}
                    fontStyle="Body12Bold"
                    colorTheme={'price'}
                  />
                </Block>
              </Block>
              <Block paddingHorizontal={4} rowGap={4}>
                <Text
                  //@ts-ignore
                  text={item?.ListSegment?.[0]?.infoHotel?.hotel?.t18n}
                  fontStyle="Body14Semi"
                  colorTheme="neutral100"
                />
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon icon="pin_outline" size={12} colorTheme="neutral100" />
                  <Text
                    //@ts-ignore
                    text={item?.ListSegment?.[0]?.infoHotel?.hotel?.description}
                    fontStyle="Body10Reg"
                    colorTheme="neutral100"
                  />
                </Block>
              </Block>
            </Block>
          </Block>
        )
      );
    },
    [],
  );

  if (hotels === undefined || hotels?.every(it => it.hotel === null)) {
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
