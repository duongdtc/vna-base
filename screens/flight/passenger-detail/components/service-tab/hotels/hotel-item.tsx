import { Block, Icon, Text } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { HotelItemProps } from '../type';

export const HotelItem = (props: HotelItemProps) => {
  const { flightIndex, onPress, airportIdx } = props;

  const { control } = useFormContext<PassengerForm>();

  const hotel = useWatch({
    control,
    name: `Hotels.${flightIndex}.${airportIdx}`,
  });

  return (
    <TouchableOpacity
      style={{ padding: 12 }}
      activeOpacity={ActiveOpacity}
      onPress={() => {
        onPress({
          selected: hotel,
          flightIndex,
          airportIdx,
        });
      }}>
      {!hotel ? (
        <Block flexDirection="row" columnGap={4} alignItems="center">
          <Block flex={1}>
            <Text
              text="Khách sạn"
              fontStyle="Body14Med"
              colorTheme="neutral100"
            />
          </Block>
          <Text text="Chưa chọn" fontStyle="Body14Med" colorTheme="neutral80" />
          <Icon
            icon="arrow_ios_down_outline"
            size={16}
            colorTheme="neutral100"
          />
        </Block>
      ) : (
        <Block rowGap={4}>
          <Block rowGap={4}>
            <Block
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              flex={1}>
              <Text
                text="Loại phòng"
                fontStyle="Body14Med"
                colorTheme="neutral100"
              />
              <Text text="Giá" fontStyle="Body14Reg" colorTheme="neutral100" />
            </Block>
            <Block
              flexDirection="row"
              alignItems="center"
              justifyContent="center">
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text={hotel.room!.t18n}
                  fontStyle="Body12Bold"
                  colorTheme="successColor"
                />
              </Block>
              <Text
                text={hotel.room!.price?.currencyFormat()}
                fontStyle="Body12Bold"
                colorTheme="price"
              />
            </Block>
          </Block>
          <Block flex={1}>
            <Text
              text={hotel.hotel?.t18n}
              fontStyle="Body14Bold"
              colorTheme="neutral100"
              numberOfLines={2}
              ellipsizeMode="tail"
            />
          </Block>
          <Block flexDirection="row" alignItems="center" columnGap={2}>
            <Icon icon="pin_outline" size={12} colorTheme="neutral80" />
            <Block flex={1}>
              <Text
                text={hotel.hotel!.description!}
                fontStyle="Body10Reg"
                colorTheme="neutral80"
              />
            </Block>
          </Block>
        </Block>
      )}
    </TouchableOpacity>
  );
};
