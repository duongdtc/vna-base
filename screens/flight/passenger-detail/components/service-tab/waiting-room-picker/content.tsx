import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { WaitingRoom } from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useMemo } from 'react';
import { ListRenderItem, TouchableOpacity } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { WaitingRoomsFake } from '../waiting-rooms';

type Props = {
  selectedBaggage: string | undefined | null;
  flightIndex: number;
  onDone: (waitingRoom: WaitingRoom) => void;
};

export const Content = ({ onDone, flightIndex, selectedBaggage }: Props) => {
  const { styles } = useStyles(styleSheet);

  const data = useMemo(() => {
    if (!WaitingRoomsFake) {
      return [{} as WaitingRoom];
    }

    return [{} as WaitingRoom, ...WaitingRoomsFake];
  }, [flightIndex]);

  const _renderItem = useCallback<ListRenderItem<WaitingRoom>>(
    ({ item }) => {
      const selected = item.value === selectedBaggage;
      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => onDone(item)}
          style={[
            styles.itemContainer,
            selected && styles.selectedItem,
            !item.title && styles.remove,
          ]}>
          {!!item.title && (
            <Image
              source={item.img}
              containerStyle={styles.img}
              resizeMode="cover"
            />
          )}
          <Block rowGap={4} flex={1}>
            <Block
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text
                text={item.title ?? undefined}
                t18n={item.title ? undefined : 'common:no_select'}
                fontStyle="Body14Semi"
                colorTheme="neutral100"
              />
              <Text
                text={item.price?.currencyFormat()}
                fontStyle="Body14Semi"
                colorTheme="price"
              />
            </Block>
            {!!item.title && (
              <Block flexDirection="row" columnGap={4} alignItems="center">
                <Text
                  text="Bao gồm:"
                  fontStyle="Body12Reg"
                  colorTheme="neutral80"
                />
                <Icon icon="car_fill" size={10} colorTheme="neutral80" />
                <Icon icon="wifi_fill" size={10} colorTheme="neutral80" />
                <Icon icon="eat_fill" size={10} colorTheme="neutral80" />
                <Icon
                  icon="arrow_circle_up_fill"
                  size={10}
                  colorTheme="neutral80"
                />
                <Icon icon="attach_outline" size={10} colorTheme="neutral80" />
              </Block>
            )}
          </Block>
        </TouchableOpacity>
      );
    },
    [
      onDone,
      selectedBaggage,
      styles.img,
      styles.itemContainer,
      styles.selectedItem,
    ],
  );

  return (
    <Block flex={1}>
      <BottomSheetFlatList<WaitingRoom>
        keyboardShouldPersistTaps="handled"
        data={data}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString() + item.value}
        contentContainerStyle={styles.contentContainer}
      />
    </Block>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings, radius }) => ({
  itemContainer: {
    padding: spacings[8],
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacings[8],
    paddingRight: spacings[12],
  },
  remove: { paddingVertical: spacings[16], paddingHorizontal: spacings[12] },
  selectedItem: { backgroundColor: colors.infoSurface },
  contentContainer: { paddingBottom: UnistylesRuntime.insets.bottom },
  img: {
    width: (UnistylesRuntime.screen.width * 72) / 390,
    height: '100%',
    borderRadius: radius[8],
    overflow: 'hidden',
  },
}));
