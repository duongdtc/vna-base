import { Block, Text } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {
  selectBaggagesActionBooking,
  selectIsLoadingAncillariesActionBooking,
} from '@vna-base/redux/selector';
import { Ancillary } from '@services/axios/axios-ibe';
import { ColorLight } from '@theme/color';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

type Props = {
  selectedBaggage: string | undefined | null;
  flightIndex: number;
  onDone: (baggage: Ancillary) => void;
  oldBaggage: Ancillary | null | undefined;
};

export const Content = ({
  onDone,
  flightIndex,
  selectedBaggage,
  oldBaggage,
}: Props) => {
  const styles = useStyles();
  const isLoading = useSelector(selectIsLoadingAncillariesActionBooking);
  const baggages = useSelector(selectBaggagesActionBooking);

  const data = useMemo<Array<Ancillary & { disable?: boolean }>>(() => {
    if (!baggages[flightIndex.toString()]) {
      return [{}];
    }

    return [
      { disable: true },
      ...baggages[flightIndex.toString()].map(bg => ({
        ...bg,
        disable:
          (bg.Price ?? 0) <= (oldBaggage?.Price ?? 0) &&
          bg.Value !== oldBaggage?.Value,
      })),
    ];
  }, [baggages, flightIndex, oldBaggage]);

  const _renderItem = useCallback<
    ListRenderItem<Ancillary & { disable?: boolean }>
  >(
    ({ item }) => {
      const selected = item.Value === selectedBaggage;

      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => onDone(item)}
          disabled={item.disable}
          style={[
            styles.itemContainer,
            selected && styles.selectedItem,
            item.disable && { opacity: 0.6 },
          ]}>
          <Block flex={1}>
            <Text
              numberOfLines={2}
              text={item.Name ?? undefined}
              t18n={item.Name ? undefined : 'common:no_select'}
              fontStyle="Body14Semi"
              colorTheme="neutral900"
            />
          </Block>
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
          <ActivityIndicator size="small" color={ColorLight.primary500} />
        </Block>
      ) : (
        <BottomSheetFlatList<Ancillary & { disable?: boolean }>
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
