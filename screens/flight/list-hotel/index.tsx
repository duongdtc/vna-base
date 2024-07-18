/* eslint-disable react/no-unstable-nested-components */
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createStyleSheet, useStyles } from '@theme';
import { I18nKeys } from '@translations/locales';
import { APP_SCREEN, RootStackParamList } from '@utils';
import {
  Block,
  Button,
  NormalHeader,
  Screen,
  Separator,
  Text,
  TextInputWithLeftIcon,
} from '@vna-base/components';
import { HitSlop, scale } from '@vna-base/utils';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import {
  HotelDetail,
  HotelEnum,
  ListHotelDetails,
  ListRoomDetails,
  RoomEnum,
} from './dummy';
import { ItemHotel } from './item-hotel';
import { ModalPicker } from './modal-picker';
import { Item, ModalPickerRef } from './modal-picker/type';

export const ListHotelScreen = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.LIST_HOTEL>) => {
  const { styles } = useStyles(styleSheet);
  const { initData, onDone } = route.params;

  const btsRoomRef = useRef<ModalPickerRef>(null);

  const refHotelId = useRef<HotelEnum | null>(null);
  const [keyword, setKeyword] = useState('');
  const [filteredData, setFilteredData] = useState<HotelDetail[]>(
    Object.values(ListHotelDetails),
  );

  const chooseRoom = (keyRoom: RoomEnum) => {
    const roomSelected = ListRoomDetails[keyRoom];
    const hotelSelect = ListHotelDetails[refHotelId.current ?? HotelEnum.ZERO];

    onDone({
      hotel: hotelSelect,
      room: roomSelected,
    });
    goBack();
  };

  const handleSearch = useCallback((text: string) => {
    setKeyword(text);
    if (text) {
      const newData = Object.values(ListHotelDetails).filter(item => {
        const itemData = item.t18n.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(Object.values(ListHotelDetails));
    }
  }, []);

  const openBtsRoom = useCallback(
    (key: HotelEnum) => {
      if (key === HotelEnum.ZERO) {
        onDone({
          hotel: null,
          room: null,
        });
        goBack();
      } else {
        refHotelId.current = key;
        btsRoomRef.current?.present(initData.room?.key);
      }
    },
    [initData.room?.key, onDone],
  );

  const renderItem = useCallback<ListRenderItem<HotelDetail>>(
    ({ item }) => {
      const selected = item.key === initData.hotel?.key;

      return (
        <ItemHotel
          item={item}
          selected={selected}
          openBtsRoom={() => openBtsRoom(item.key)}
        />
      );
    },
    [initData, openBtsRoom],
  );

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral10"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="arrow_ios_left_fill"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();
            }}
            padding={4}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            text="Chọn khách sạn"
            colorTheme="neutral900"
          />
        }
      />
      <Block
        flex={1}
        borderTopWidth={10}
        borderColorTheme="neutral200"
        paddingVertical={12}>
        <Block paddingHorizontal={8}>
          <TextInputWithLeftIcon
            leftIcon="search_fill"
            style={styles.input}
            styleInput={styles.inputBase}
            leftIconSize={24}
            value={keyword}
            onChangeText={txt => handleSearch(txt)}
            placeholder={'Nhập để tìm kiếm khách sạn...'}
          />
          <Separator size={3} type="horizontal" />
        </Block>
        <FlatList
          data={filteredData}
          keyExtractor={item => `${item.key}`}
          renderItem={renderItem}
          contentContainerStyle={{
            marginTop: scale(12),
            paddingBottom: scale(12) + UnistylesRuntime.insets.bottom,
          }}
          ItemSeparatorComponent={() => (
            <Separator size={3} type="horizontal" />
          )}
        />
      </Block>
      <ModalPicker
        ref={btsRoomRef}
        data={Object.values(ListRoomDetails) as Item[]}
        snapPoints={['80%']}
        t18nTitle={'Chọn phòng' as I18nKeys}
        handleDone={chooseRoom}
      />
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  container: { backgroundColor: colors.neutral10 },
  input: {
    backgroundColor: colors.neutral10,
  },
  inputBase: {
    color: colors.neutral900,
  },
}));
