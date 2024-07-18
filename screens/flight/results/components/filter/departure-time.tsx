import { SectionContainer } from '@screens/flight/results/components/filter/section-container';
import { createStyleSheet, useStyles } from '@theme';
import { LazyPlaceholder } from '@vna-base/components';
import { FilterForm } from '@vna-base/screens/flight/type';
import { save, scale, StorageKey, WindowWidth } from '@vna-base/utils';
import React, { memo, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { View } from 'react-native';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { ScrollBarTab } from './scroll-bar-tab';
import { TabBarDepartureTime } from './tab-bar-departure-time';
import { TimeSlotTab } from './time-slot-tab';

const TabName = {
  TIME_SLOT: 'TIME_SLOT',
  SCROLL_BAR: 'SCROLL_BAR',
};

export const DepartureTime = memo(({ initTab }: { initTab: number }) => {
  const { styles } = useStyles(styleSheet);

  const { setValue } = useFormContext<FilterForm>();

  const [index, setIndex] = useState(initTab);

  const [routes] = useState([
    {
      key: TabName.SCROLL_BAR,
      title: 'flight:scroll_bar',
    },
    {
      key: TabName.TIME_SLOT,
      title: 'flight:time_slot',
    },
  ]);

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (route.key) {
        case TabName.SCROLL_BAR:
          return <ScrollBarTab />;
        case TabName.TIME_SLOT:
          return <TimeSlotTab />;
      }
    },
    [],
  );

  const onChangeIndex = (i: number) => {
    const type = i === 0 ? 'DepartTimeRange' : 'DepartTimeTimeSlot';
    setValue('DepartTimeType', type);
    setIndex(i);
    save(StorageKey.DEPART_TIME_TYPE, type);
  };

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      },
    ) => <TabBarDepartureTime {...props} />,
    [],
  );

  return (
    <SectionContainer t18n="flight:departure_time">
      <View style={styles.tabContainer}>
        <TabView
          navigationState={{ index, routes }}
          lazy
          swipeEnabled={false}
          renderScene={renderScene}
          onIndexChange={onChangeIndex}
          initialLayout={{ width: WindowWidth }}
          renderTabBar={renderTabBar}
          renderLazyPlaceholder={() => <LazyPlaceholder height={200} />}
        />
      </View>
    </SectionContainer>
  );
});

const styleSheet = createStyleSheet(({ colors, spacings, shadows }) => ({
  container: {
    backgroundColor: colors.neutral10,
    marginTop: spacings[12],
  },
  titleContainer: {
    paddingHorizontal: spacings[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacings[12],
    backgroundColor: colors.neutral10,
    ...shadows['.3'],
  },
  tabContainer: {
    height: scale(166),
  },
}));
