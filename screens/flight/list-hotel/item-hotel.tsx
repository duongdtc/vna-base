/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Button, Icon, Image, Text } from '@vna-base/components';
import { Currency, HitSlop } from '@vna-base/utils';
import React from 'react';
import { Pressable } from 'react-native';
import { HotelDetail, HotelEnum } from './dummy';
import { Rating } from './rating-hotel';

type Props = {
  item: HotelDetail;
  selected: boolean;
  openBtsRoom: () => void;
};
export const ItemHotel = ({ item, selected, openBtsRoom }: Props) => {
  return (
    <Pressable onPress={openBtsRoom}>
      <Block
        flexDirection="row"
        columnGap={8}
        padding={8}
        colorTheme={selected ? 'success100' : 'neutral10'}>
        {item.key !== HotelEnum.ZERO ? (
          <>
            <Block width={98} height={92} borderRadius={4} overflow="hidden">
              <Image
                source={item.image!}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </Block>
            <Block flex={1} rowGap={6}>
              <Block flexDirection="row" alignItems="center" columnGap={4}>
                <Text
                  text={item.t18n}
                  fontStyle="Body14Semi"
                  colorTheme="neutral100"
                />
                <Rating rate={item.star as number} />
              </Block>
              <Block flexDirection="row" alignItems="center" columnGap={4}>
                <Icon icon="pin_outline" size={12} colorTheme="neutral100" />
                <Text
                  text={item.description!}
                  fontStyle="Body10Reg"
                  colorTheme="neutral100"
                />
              </Block>
              <Block flexDirection="row" alignItems="center" columnGap={4}>
                <Text
                  text="Bao gồm: "
                  fontStyle="Body10Reg"
                  colorTheme="neutral80"
                />
                <Icon icon="car_fill" size={12} colorTheme="neutral100" />
                <Icon icon="wifi_fill" size={12} colorTheme="neutral100" />
                <Icon icon="eat_fill" size={12} colorTheme="neutral100" />
                <Icon icon="camera_fill" size={12} colorTheme="neutral100" />
                <Icon icon="brush_fill" size={12} colorTheme="neutral100" />
              </Block>
              <Block
                flex={1}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Text fontStyle="Body12Reg" colorTheme="neutral80">
                  {'Từ '}
                  <Text fontStyle="Body14Semi" colorTheme="price">
                    {item.price?.currencyFormat()}{' '}
                    <Text
                      text={Currency.VND}
                      fontStyle="Body14Semi"
                      colorTheme="neutral100"
                    />
                  </Text>
                </Text>
                <Block flex={1} alignItems="flex-end">
                  <Button
                    hitSlop={HitSlop.Medium}
                    text="Chọn phòng"
                    rightIcon="arrow_ios_right_fill"
                    rightIconSize={16}
                    textColorTheme="primaryColor"
                    textFontStyle="Body14Semi"
                    onPress={openBtsRoom}
                    padding={4}
                  />
                </Block>
              </Block>
            </Block>
          </>
        ) : (
          <Block paddingBottom={8} paddingLeft={8}>
            <Text
              text={item.t18n}
              fontStyle="Body14Semi"
              colorTheme="neutral100"
            />
          </Block>
        )}
      </Block>
    </Pressable>
  );
};
