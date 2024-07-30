import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { ShuttleCar } from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useMemo } from 'react';
import { ListRenderItem, TouchableOpacity } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { ShuttleCarsFake } from '../shuttle-cars';

type Props = {
  selectedBaggage: string | undefined | null;
  flightIndex: number;
  airportIdx: number;
  onDone: (shuttleCar: ShuttleCar) => void;
};

export const Content = ({
  onDone,
  flightIndex,
  selectedBaggage,
  airportIdx,
}: Props) => {
  const { styles } = useStyles(styleSheet);

  const data = useMemo(() => {
    return [{} as ShuttleCar, ...ShuttleCarsFake];
  }, []);

  const _renderItem = useCallback<ListRenderItem<ShuttleCar>>(
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
              source={item.image}
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
                <Icon icon="people_outline" size={14} colorTheme="neutral800" />
                <Text
                  text={item.capacity}
                  fontStyle="Body12Reg"
                  colorTheme="neutral100"
                />
                <Text
                  text={item.description}
                  fontStyle="Body12Reg"
                  colorTheme="neutral100"
                />
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
      styles.remove,
      styles.selectedItem,
    ],
  );

  return (
    <Block flex={1}>
      <BottomSheetFlatList<ShuttleCar>
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
