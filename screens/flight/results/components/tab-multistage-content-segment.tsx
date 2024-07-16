/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LazyPlaceholder, Text } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AirOptionCustom } from '@vna-base/screens/flight/type';
import { Flight } from '@services/axios/axios-ibe';
import { useStyles } from '@theme';
import { Spacing } from '@theme/type';
import { I18nKeys } from '@translations/locales';
import { WindowWidth, scale } from '@vna-base/utils';
import React, { memo, useCallback, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import {
  SceneRendererProps,
  TabBar,
  TabView,
  Route as arrayRoute,
} from 'react-native-tab-view';
import { ListSegmentInfo } from './list-segment-info';

type Props = {
  dataSelected: AirOptionCustom;
};

export const paddingLeftContentModal: Spacing = 12;

export const RenderContentTabMultiStage = memo((props: Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles();

  const { dataSelected } = props;

  const [index, setIndex] = useState<number>(0);

  const renderTabs = (array: Flight[] | null | undefined) => {
    const tabNames = {};
    const arrRoutes: arrayRoute[] = [];

    //@ts-ignore
    for (let i = 0; i < array?.length; i++) {
      const tabName = `TabName${i + 1}`;
      //@ts-ignore
      tabNames[tabName] = `tabname_${i + 1}`;

      const startCode = array?.[i].StartPoint;
      const endCode = array?.[i].EndPoint;
      const title = `${startCode} -> ${endCode}`;
      arrRoutes.push({ key: tabName, title: title });
    }

    return { tabNames, arrRoutes };
  };

  const { tabNames, arrRoutes } = renderTabs(
    dataSelected?.ListFlightOption?.[0]?.ListFlight,
  );

  const TabName = tabNames;

  const routes = arrRoutes;

  const renderTabBar = useCallback(
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    props => {
      return (
        <TabBar
          {...props}
          style={{ backgroundColor: colors.neutral10 }}
          tabStyle={styles.tabBar}
          scrollEnabled
          renderLabel={({ route, focused }) => {
            return (
              <View style={{ width: scale(120) }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    fontStyle={'Body16Semi'}
                    colorTheme={focused ? 'primaryColor' : 'neutral60'}
                    t18n={route.title as I18nKeys}
                  />
                </View>
                {focused && (
                  <View
                    style={{
                      width: '100%',
                      height: scale(4),
                      backgroundColor: colors.primaryColor,
                      position: 'absolute',
                      borderTopLeftRadius: scale(8),
                      borderTopRightRadius: scale(8),
                      bottom: -16,
                    }}
                  />
                )}
              </View>
            );
          }}
        />
      );
    },
    [colors.neutral10, colors.primaryColor, styles.tabBar],
  );

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: arrayRoute;
    }) => {
      const arrTabName = Object.keys(TabName);
      const tabIndex = arrTabName.indexOf(route.key);
      if (tabIndex !== -1) {
        const tabName = arrTabName[tabIndex];

        switch (tabName) {
          case route.key:
            return (
              <BottomSheetScrollView
                nestedScrollEnabled
                scrollEnabled
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    justifyContent: 'center',
                    backgroundColor: colors.neutral10,
                    padding: scale(12),
                  }}>
                  <ListSegmentInfo
                    listSegments={
                      dataSelected.ListFlightOption?.[0].ListFlight![tabIndex]
                        ?.ListSegment
                    }
                  />
                </View>
              </BottomSheetScrollView>
            );
        }
      }
    },
    [TabName, colors.neutral10, dataSelected.ListFlightOption],
  );

  useEffect(() => {
    return () => {
      setIndex(0);
    };
  }, [dataSelected]);

  return (
    <TabView
      navigationState={{ index, routes }}
      lazy
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{ width: WindowWidth }}
      renderLazyPlaceholder={() => <LazyPlaceholder height={200} />}
    />
  );
}, isEqual);
