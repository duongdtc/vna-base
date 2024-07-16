/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LazyPlaceholder, Text } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AirOptionCustom } from '@vna-base/screens/flight/type';
import { createStyleSheet, useStyles } from '@theme';
import { Spacing } from '@theme/type';
import { translate } from '@vna-base/translations/translate';
import { WindowWidth, scale } from '@vna-base/utils';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import { ListSegmentInfo } from './list-segment-info';

type Props = {
  dataSelected: AirOptionCustom;
};

const TabName = {
  TAKE_OFF: 'TAKE_OFF',
  LANDING: 'LANDING',
};

export const paddingLeftContentModal: Spacing = 12;

export const RenderContentTabRoundTrip = (prop: Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const { dataSelected } = prop;

  // check show icon arrow more có hiển thị hay không

  const [index, setIndex] = useState<number>(0);

  const [routes] = useState([
    {
      key: TabName.TAKE_OFF,
      title: translate('flight:outbound'),
    },
    {
      key: TabName.LANDING,
      title: translate('flight:inbound'),
    },
  ]);

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      },
    ) => {
      return (
        <TabBar
          {...props}
          tabStyle={styles.tabBar}
          renderLabel={({ route, focused }) => {
            return (
              <View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    fontStyle={focused ? 'Body16Semi' : 'Body16Reg'}
                    colorTheme={focused ? 'primaryColor' : 'neutral60'}
                    text={route.title}
                  />
                </View>
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -16,
                      left: -WindowWidth / 5.7,
                      height: scale(4),
                      backgroundColor: colors.primaryColor,
                      width: WindowWidth / 2,
                    }}
                  />
                )}
              </View>
            );
          }}
        />
      );
    },
    [colors.primaryColor, styles.tabBar],
  );

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (route.key) {
        case TabName.TAKE_OFF:
          return (
            <BottomSheetScrollView
              nestedScrollEnabled
              scrollEnabled
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  justifyContent: 'center',
                  backgroundColor: colors.neutral10,
                  padding: paddingLeftContentModal,
                }}>
                <ListSegmentInfo
                  listSegments={
                    dataSelected.ListFlightOption?.[0].ListFlight![0]
                      .ListSegment
                  }
                />
              </View>
            </BottomSheetScrollView>
          );

        case TabName.LANDING:
          return (
            <BottomSheetScrollView
              nestedScrollEnabled
              scrollEnabled
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  justifyContent: 'center',
                  backgroundColor: colors.neutral10,
                  padding: paddingLeftContentModal,
                }}>
                <ListSegmentInfo
                  listSegments={
                    dataSelected.ListFlightOption?.[0].ListFlight![1]
                      .ListSegment
                  }
                />
              </View>
            </BottomSheetScrollView>
          );
      }
    },
    [colors.neutral10, dataSelected.ListFlightOption],
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      lazy
      swipeEnabled
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{ width: WindowWidth }}
      renderLazyPlaceholder={() => <LazyPlaceholder height={200} />}
    />
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  tabBar: { backgroundColor: colors.neutral10 },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
