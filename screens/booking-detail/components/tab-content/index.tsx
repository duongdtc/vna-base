import { Block, LazyPlaceholder, Text } from '@vna-base/components';
import { selectViewingBookingId } from '@redux-selector';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, WindowWidth } from '@vna-base/utils';
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
import { useSelector } from 'react-redux';
import {
  OthersInfoTab,
  PassengersTab,
  ServicesTab,
  TicketClassTab,
  TicketsTab,
  TripsTab,
} from './components';
import { useStyles } from './style';

const TabName = {
  TRIPS: 'TRIPS',
  TICKETS: 'TICKETS',
  TICKET_CLASS: 'TICKET_CLASS',
  PASSENGERS: 'PASSENGERS',
  SERVICES: 'SERVICES',
  OTHERS_INFO: 'OTHERS_INFO',
};

const routes = [
  //
  {
    key: TabName.TRIPS,
    title: 'booking:procedure',
  },
  {
    key: TabName.PASSENGERS,
    title: 'booking:passenger',
  },
  {
    key: TabName.TICKETS,
    title: 'booking:tickets',
  },
  {
    key: TabName.SERVICES,
    title: 'booking:service',
  },
  {
    key: TabName.TICKET_CLASS,
    title: 'booking:ticket_class',
  },

  {
    key: TabName.OTHERS_INFO,
    title: 'booking:others_info',
  },
];

export const TabContent = memo(() => {
  const styles = useStyles();

  const bookingId = useSelector(selectViewingBookingId);

  const [index, setIndex] = useState(0);

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
        tabStyle={[styles.tabBar, { width: 130 }]}
        scrollEnabled
        renderLabel={({ route, focused }) => {
          return (
            <Block width={130}>
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
        // procedure tab
        case TabName.TRIPS:
          return <TripsTab />;

        // passenger tab
        case TabName.PASSENGERS:
          return <PassengersTab />;

        // ticket tab
        case TabName.TICKETS:
          return <TicketsTab />;

        // service tab
        case TabName.SERVICES:
          return <ServicesTab />;

        // ticket class tab
        case TabName.TICKET_CLASS:
          return <TicketClassTab />;

        // others info tab
        case TabName.OTHERS_INFO:
          return <OthersInfoTab />;
      }
    },
    [],
  );

  if (!bookingId) {
    return null;
  }

  // render
  return (
    <TabView
      style={{ marginTop: 4 }}
      navigationState={{ index, routes }}
      lazy
      swipeEnabled
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      pagerStyle={styles.pager}
      initialLayout={{ width: WindowWidth }}
      renderLazyPlaceholder={() => <LazyPlaceholder height={200} />}
    />
  );
}, isEqual);
