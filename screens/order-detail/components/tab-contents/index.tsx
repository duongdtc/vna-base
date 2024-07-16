import { Block, LazyPlaceholder, Text } from '@vna-base/components';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, WindowWidth, scale } from '@vna-base/utils';
import React, { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity } from 'react-native';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import {
  TabBooking,
  TabContact,
  TabNote,
  TabOrder,
  TabPayment,
  TabTicket,
} from './components';
import { useStyles } from './style';
import { AvoidSoftInput } from 'react-native-avoid-softinput';

const TabName = {
  BOOKING: 'BOOKING',
  TICKETS: 'TICKETS',
  NOTE: 'NOTE',
  PAYMENT: 'PAYMENT',
  ORDER: 'ORDER',
  CONTACT: 'CONTACT',
};

export const TabOrderContents = memo(({ id }: { id: string }) => {
  const styles = useStyles();

  const [index, setIndex] = useState<number>(0);

  const [routes] = useState([
    {
      key: TabName.BOOKING,
      title: 'order_detail:booking',
    },
    {
      key: TabName.TICKETS,
      title: 'order_detail:ticket',
    },
    {
      key: TabName.NOTE,
      title: 'order_detail:note',
    },
    {
      key: TabName.PAYMENT,
      title: 'order_detail:payment',
    },
    {
      key: TabName.ORDER,
      title: 'order_detail:order',
    },
    {
      key: TabName.CONTACT,
      title: 'order_detail:contact',
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
        style={[styles.tabBar]}
        indicatorStyle={styles.tabBar}
        tabStyle={[styles.tabBar, { width: scale(100) }]}
        scrollEnabled
        gap={8}
        renderLabel={({ route, focused }) => {
          return (
            <Block width={100}>
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

  const onIndexChange = useCallback((idx: number) => {
    setIndex(idx);
    //booking tab
    if (idx === 0) {
      AvoidSoftInput.setShouldMimicIOSBehavior(true);
      AvoidSoftInput.setEnabled(true);
      AvoidSoftInput.setAvoidOffset(0);
    }

    //Note tab
    if (idx === 2) {
      AvoidSoftInput.setAvoidOffset(0);
      AvoidSoftInput.setEnabled(false);
      AvoidSoftInput.setShouldMimicIOSBehavior(true);
    }

    //PaymentTab tab
    if (idx === 3) {
      AvoidSoftInput.setShouldMimicIOSBehavior(true);
      AvoidSoftInput.setEnabled(true);
      AvoidSoftInput.setAvoidOffset(70);
      AvoidSoftInput.setShowAnimationDuration(200);
      AvoidSoftInput.setShowAnimationDelay(0);
      AvoidSoftInput.setHideAnimationDuration(200);
      AvoidSoftInput.setHideAnimationDelay(0);
    }
  }, []);

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (route.key) {
        // booking tab
        case TabName.BOOKING:
          return <TabBooking id={id} />;

        // ticket tab
        case TabName.TICKETS:
          return <TabTicket id={id} />;

        // note tab
        case TabName.NOTE:
          return <TabNote id={id} />;

        // payment tab
        case TabName.PAYMENT:
          return <TabPayment />;

        // order tab
        case TabName.ORDER:
          return <TabOrder />;

        // contact tab
        case TabName.CONTACT:
          return <TabContact />;
      }
    },
    [],
  );

  // render
  return (
    <TabView
      navigationState={{ index, routes }}
      lazy
      pagerStyle={styles.pager}
      swipeEnabled
      renderScene={renderScene}
      onIndexChange={onIndexChange}
      renderTabBar={renderTabBar}
      initialLayout={{ width: WindowWidth }}
      renderLazyPlaceholder={() => <LazyPlaceholder height={200} />}
    />
  );
}, isEqual);
