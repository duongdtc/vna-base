import { images } from '@vna-base/assets/image';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import React, { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useController } from 'react-hook-form';
import {
  FlatList,
  LayoutAnimation,
  ListRenderItem,
  Pressable,
  TouchableOpacity,
} from 'react-native';

type Insurance = {
  value: string | null;
  title: string;
  img?: string;
  price?: number;
  subtitle?: string;
  benefit?: string;
};

export const ListInsurance: Array<Insurance> = [
  {
    title: 'Bảo hiểm du lịch TripCare',
    value: 'TripCare',
    price: 108_000,
    img: images.insuranceImg,
    subtitle: 'Bảo hiểm trễ/huỷ chuyến bay nội địa',
    benefit: 'Khách hàng của bạn sẽ được đền bù lên đến 1 triệu đồng',
  },
  {
    title: 'Bảo hiểm du lịch Saladin',
    value: 'Saladin',
    price: 138_000,
    img: images.saladin_piyqkh,
    subtitle: 'Bảo hiểm trễ/huỷ chuyến bay nội địa',
    benefit: 'Khách hàng của bạn sẽ được đền bù lên đến 1 triệu đồng',
  },
];

export const Insurances = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    field: { value, onChange },
  } = useController<PassengerForm, 'Insurance'>({
    name: 'Insurance',
  });

  const toggle = useCallback(() => {
    setIsOpen(pre => !pre);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 180,
    });
  }, []);

  const renderItem = useCallback<ListRenderItem<Insurance>>(
    ({ item, index }) => {
      const isSelected = value === item.value;

      return (
        <Pressable
          onPress={() => {
            onChange(isSelected ? null : item.value);
          }}>
          <Block
            borderWidth={5}
            borderColorTheme="neutral200"
            borderRadius={8}
            overflow="hidden">
            <Block
              paddingVertical={12}
              paddingHorizontal={8}
              flexDirection="row"
              alignItems="center"
              colorTheme="neutral50"
              columnGap={8}>
              <Block flex={1}>
                <Text
                  text={`${index + 1}. ${item.title}`}
                  fontStyle="Title16Semi"
                  colorTheme="neutral100"
                />
              </Block>
              <Icon
                icon={
                  isSelected
                    ? 'checkmark_circle_2_fill'
                    : 'radio_button_off_fill'
                }
                size={24}
                colorTheme={isSelected ? 'successColor' : 'neutral60'}
              />
            </Block>
            {!!item.value && (
              <Block padding={8} rowGap={12}>
                <Image
                  source={item.img!}
                  containerStyle={{
                    width: '100%',
                    height: 106,
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                  resizeMode="cover"
                />
                <Block rowGap={8}>
                  <Text
                    text={item.subtitle}
                    fontStyle="Body14Semi"
                    colorTheme="neutral100"
                  />
                  <Text
                    fontStyle="Body12Med"
                    colorTheme="neutral100"
                    numberOfLines={2}>
                    {'Quyền lợi: '}
                    <Text
                      text={item.benefit}
                      fontStyle="Body12Reg"
                      colorTheme="neutral100"
                    />
                  </Text>
                  <Block
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        flexDirection: 'row',
                        columnGap: 2,
                        alignItems: 'center',
                        borderRadius: 12,
                        backgroundColor: '#F5F5F5',
                      }}>
                      <Text
                        text="Chi tiết"
                        fontStyle="Capture11Reg"
                        colorTheme="primaryPressed"
                      />
                      <Icon
                        icon="external_link_fill"
                        size={12}
                        colorTheme="primaryPressed"
                      />
                    </TouchableOpacity>
                    <Text
                      text={item.price?.currencyFormat()}
                      fontStyle="Title16Semi"
                      colorTheme="price"
                    />
                  </Block>
                </Block>
              </Block>
            )}
          </Block>
        </Pressable>
      );
    },
    [onChange, value],
  );

  return (
    <Block colorTheme="neutral100" borderRadius={8}>
      <Pressable onPress={toggle}>
        <Block
          flexDirection="row"
          alignItems="center"
          columnGap={8}
          padding={12}>
          <Icon icon="Noti_Money" size={20} colorTheme="neutral700" />
          <Block flex={1}>
            <Text
              text="Bảo hiểm du lịch"
              fontStyle="Title16Semi"
              colorTheme="neutral100"
            />
          </Block>
          <Icon
            icon={isOpen ? 'arrow_ios_up_outline' : 'arrow_ios_down_outline'}
            size={24}
            colorTheme="neutral100"
          />
        </Block>
      </Pressable>
      <Block height={isOpen ? 'auto' : 0} overflow="hidden">
        <Block paddingHorizontal={12} paddingBottom={12}>
          <FlatList
            data={ListInsurance}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Block height={12} />}
          />
        </Block>
      </Block>
    </Block>
  );
}, isEqual);
