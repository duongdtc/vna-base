import { ContentLoading, EmptyList, Separator } from '@vna-base/components';
import { FLightItemInResultScreen } from '@vna-base/screens/flight/type';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { createStyleSheet, useStyles } from '@theme';
import { WindowWidth, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useFilterContext } from '../filter-provider';
import { FlightItem } from './flight-item';
import { ProgressBar } from './progress-bar';
import { SelectedFlightItem } from './selected-flight-item';
import { SeparatorListFlight } from './separator-list-flight';

export const ListFlight = memo(() => {
  const { styles } = useStyles(styleSheet);

  const {
    onSelectItem,
    onReselectItem,
    showFareOption,
    showDetailAirOption,
    listFlightRef,
    isCryptic,
    listFlight,
  } = useFilterContext();

  const renderItem = useCallback<ListRenderItem<FLightItemInResultScreen>>(
    ({ item, index }) => {
      if (isEmpty(item)) {
        return <ContentLoading width={WindowWidth - scale(40)} />;
      }

      if (item?.Type && item?.Type !== 'Fastest' && item?.Type !== 'MinPrice') {
        return <SeparatorListFlight Type={item.Type} />;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if (item.selected) {
        return (
          <SelectedFlightItem
            item={item}
            index={index}
            onPressItem={showDetailAirOption}
            key={`${item?.OptionId}_${index}`}
            reselect={onReselectItem}
            showFareOption={showFareOption}
          />
        );
      }

      return (
        <FlightItem
          index={index}
          onPressItem={showDetailAirOption}
          item={item}
          onSelectItem={onSelectItem}
          style={styles.itemContainer}
          showFareOption={showFareOption}
        />
      );
    },
    [
      showDetailAirOption,
      onSelectItem,
      styles.itemContainer,
      showFareOption,
      onReselectItem,
    ],
  );

  return (
    <View style={styles.container}>
      <ProgressBar />
      <FlashList
        ref={listFlightRef}
        indicatorStyle={'black'}
        extraData={isCryptic}
        data={listFlight}
        estimatedItemSize={isCryptic ? scale(42) : scale(180)}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyList
            style={{ height: scale(500) }}
            image="emptyListFlight"
            imageStyle={styles.emptyImg}
          />
        }
        // contentContainerStyle={{ paddingTop: 4 }}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <Separator type="horizontal" />}
      />
    </View>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, spacings, radius }) => ({
  container: {
    flex: 1,
    paddingTop: spacings[8],
    overflow: 'hidden',
    backgroundColor: colors.neutral30,
  },
  itemContainer: {
    padding: spacings[12],
    borderRadius: radius[8],
    backgroundColor: colors.neutral10,
  },
  containerMinimize: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  firstMinimize: {
    borderTopLeftRadius: radius[8],
    borderTopRightRadius: radius[8],
  },
  contentContainerModal: {
    flex: 1,
    alignItems: 'center',
  },
  emptyImg: {
    width: scale(234),
    height: scale(132),
  },
}));
