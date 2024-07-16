import { Block, BottomSheet, LazyPlaceholder, Text } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, scale, SnapPoint, WindowWidth } from '@vna-base/utils';
import React, { forwardRef, memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity } from 'react-native';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import { DetailTab, EachPassengerTab } from './components';
import { useStyles } from './style';

const TabName = {
  EACH_PASSENGER: 'EACH_PASSENGER',
  DETAIL: 'DETAIL',
};

export const TicketFareBottomSheet = memo(
  forwardRef<NormalRef, any>((_, ref) => {
    const styles = useStyles();

    const [index, setIndex] = useState(0);

    const [routes] = useState([
      {
        key: TabName.EACH_PASSENGER,
        title: 'booking:each_passenger',
      },
      {
        key: TabName.DETAIL,
        title: 'booking:detail',
      },
    ]);

    const renderTabBar = useCallback(
      (
        props: SceneRendererProps & {
          navigationState: NavigationState<Route>;
        },
      ) => (
        <TabBar
          {...props}
          style={[styles.tabBar, { paddingHorizontal: 16 }]}
          indicatorStyle={styles.tabBar}
          tabStyle={[styles.tabBar, { width: (WindowWidth - scale(32)) / 2 }]}
          scrollEnabled
          renderLabel={({ route, focused }) => {
            return (
              <Block width={(WindowWidth - scale(32)) / 2}>
                <TouchableOpacity
                  activeOpacity={ActiveOpacity}
                  style={[styles.tab]}>
                  <Block justifyContent="center" alignItems="center">
                    <Text
                      fontStyle="Body16Reg"
                      colorTheme={focused ? 'neutral900' : 'neutral600'}
                      t18n={route.title as I18nKeys}
                    />
                  </Block>
                </TouchableOpacity>
                {focused && (
                  <Block
                    width={'100%'}
                    colorTheme="primary500"
                    height={4}
                    position="absolute"
                    borderTopRadius={8}
                    style={{ bottom: -16 }}
                  />
                )}
              </Block>
            );
          }}
        />
      ),
      [styles.tab, styles.tabBar],
    );

    const renderScene = useCallback(
      ({
        route,
      }: SceneRendererProps & {
        route: Route;
      }) => {
        switch (route.key) {
          case TabName.EACH_PASSENGER:
            return <EachPassengerTab />;

          case TabName.DETAIL:
            return <DetailTab />;
        }
      },
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        type="normal"
        dismissWhenClose={true}
        typeBackDrop="gray"
        enablePanDownToClose={false}
        useDynamicSnapPoint={false}
        snapPoints={[SnapPoint.Half]}
        t18nTitle="booking:price_ticket"
        showCloseButton
        showIndicator={false}>
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
      </BottomSheet>
    );
  }),
  isEqual,
);
