/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LazyPlaceholder, Text } from '@vna-base/components';
import { selectListRoute } from '@vna-base/redux/selector';
import { Route } from '@redux/type';
import { bs, createStyleSheet, useStyles } from '@theme';
import { Opacity } from '@theme/color';
import { I18nKeys } from '@translations/locales';
import { WindowWidth, scale } from '@vna-base/utils';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import { View } from 'react-native';
import {
  SceneRendererProps,
  TabBar,
  TabView,
  Route as arrayRoute,
} from 'react-native-tab-view';
import { useSelector } from 'react-redux';

export const TabHeaderFlightRoute = ({ children }: PropsWithChildren) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const [index, setIndex] = useState<number>(0);

  const listRoute = useSelector(selectListRoute);

  const renderTabs = (array: Route[] | null | undefined) => {
    const tabNames = {};
    const arrRoutes: arrayRoute[] = [];

    //@ts-ignore
    for (let i = 0; i < array?.length; i++) {
      const tabName = `TabName${i + 1}`;
      //@ts-ignore
      tabNames[tabName] = `tabname_${i + 1}`;

      const startCode = array?.[i].StartPoint;
      const endCode = array?.[i].EndPoint;
      const title = `${startCode?.Code} -> ${endCode?.Code}`;
      arrRoutes.push({ key: tabName, title: title });
    }

    return { tabNames, arrRoutes };
  };

  const { tabNames, arrRoutes } = renderTabs(listRoute);

  const TabName = tabNames;

  const routes = arrRoutes;

  const renderTabBar = useCallback(
    //@ts-ignore
    props => {
      return (
        listRoute.length !== 1 && (
          <TabBar
            {...props}
            style={{ backgroundColor: colors.primaryPressed + Opacity[0] }}
            tabStyle={[
              styles.tabBar,
              { width: listRoute.length === 2 ? WindowWidth / 2 : scale(120) },
            ]}
            scrollEnabled
            indicatorStyle={{
              backgroundColor: colors.primaryPressed + Opacity[0],
            }}
            renderLabel={({ route, focused }) => {
              return (
                <View
                  style={{
                    width:
                      listRoute.length === 2 ? WindowWidth / 2 : scale(120),
                  }}>
                  <View style={styles.justifyCenter}>
                    <Text
                      fontStyle="Body16Bold"
                      colorTheme={focused ? 'white' : 'neutral50'}
                      t18n={route.title as I18nKeys}
                    />
                  </View>
                  {focused && <View style={styles.active} />}
                </View>
              );
            }}
          />
        )
      );
    },
    [colors, listRoute.length, styles],
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
            return <View style={bs.flex}>{children}</View>;
        }
      }
    },
    [TabName, children],
  );

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
};

const styleSheet = createStyleSheet(({ colors, spacings, radius }) => ({
  bgLinearAbove: { flex: 1 },
  tabBar: {
    backgroundColor: colors.primaryPressed + Opacity[0],
  },
  justifyCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    width: '100%',
    position: 'absolute',
    bottom: -spacings[16],
    backgroundColor: colors.white,
    height: spacings[8],
    borderTopLeftRadius: radius[8],
    borderTopRightRadius: radius[8],
  },
}));
