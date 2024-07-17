import { Block, Text } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { selectBaggages, selectIsLoadingAncillaries } from '@vna-base/redux/selector';
import { Ancillary } from '@services/axios/axios-ibe';
import { lightColors } from '@theme/unistyle-temp/colors/light';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles, createStyleSheet } from '@theme';
import { UnistylesRuntime } from 'react-native-unistyles';

type Props = {
  selectedBaggage: string | undefined | null;
  flightIndex: number;
  onDone: (baggage: Ancillary) => void;
};

export const Content = ({ onDone, flightIndex, selectedBaggage }: Props) => {
  const { styles } = useStyles(styleSheet);
  const isLoading = useSelector(selectIsLoadingAncillaries);
  const baggages = useSelector(selectBaggages);

  const data = useMemo(() => {
    if (!baggages[flightIndex.toString()]) {
      return [{} as Ancillary];
    }

    return [{} as Ancillary, ...baggages[flightIndex.toString()]];
  }, [baggages, flightIndex]);

  const _renderItem = useCallback<ListRenderItem<Ancillary>>(
    ({ item }) => {
      const selected = item.Value === selectedBaggage;
      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => onDone(item)}
          style={[styles.itemContainer, selected && styles.selectedItem]}>
          <Text
            text={item.Name ?? undefined}
            t18n={item.Name ? undefined : 'common:no_select'}
            fontStyle="Body14Semi"
            colorTheme="neutral100"
          />
          <Text
            text={item.Price?.currencyFormat()}
            fontStyle="Body14Reg"
            colorTheme="price"
          />
        </TouchableOpacity>
      );
    },
    [onDone, selectedBaggage, styles.itemContainer, styles.selectedItem],
  );

  return (
    <Block flex={1}>
      {isLoading ? (
        <Block flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="small" color={lightColors.primaryColor} />
        </Block>
      ) : (
        <BottomSheetFlatList<Ancillary>
          keyboardShouldPersistTaps="handled"
          data={data}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString() + item.Value}
          contentContainerStyle={styles.contentContainer}
        />
      )}
    </Block>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  itemContainer: {
    paddingHorizontal: spacings[16],
    paddingVertical: spacings[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedItem: { backgroundColor: colors.neutral20 },
  contentContainer: { paddingBottom: UnistylesRuntime.insets.bottom },
}));
