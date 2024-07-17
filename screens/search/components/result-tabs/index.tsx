import { Block, LazyPlaceholder, Text } from '@vna-base/components';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, WindowWidth, scale } from '@vna-base/utils';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import { useStyles } from '../../styles';
import { TabAll, TabBooking, TabOrder, TabTicket } from './components';
import { useSelector } from 'react-redux';
import { selectResultSearch } from '@vna-base/redux/selector';
const TabName = {
  ALL: 'ALL',
  ORDER: 'ORDER',
  BOOKING: 'BOOKING',
  TICKET: 'TICKET',
};

export const ResultSearch = () => {
  const styles = useStyles();

  const {
    Booking: booking,
    Order: order,
    Ticket: ticket,
  } = useSelector(selectResultSearch);

  const [index, setIndex] = useState<number>(0);

  const [routes] = useState([
    {
      key: TabName.ALL,
      title: 'search:all',
    },
    {
      key: TabName.ORDER,
      title: 'search:order',
    },
    {
      key: TabName.BOOKING,
      title: 'search:booking',
    },
    {
      key: TabName.TICKET,
      title: 'search:ticket',
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
        tabStyle={[styles.tabBar, { width: scale(120) }]}
        scrollEnabled
        gap={8}
        renderLabel={({ route, focused }) => {
          let count = 0;
          switch (route.title) {
            case 'search:order':
              count = order.length;
              break;
            case 'search:booking':
              count = booking.length;
              break;
            case 'search:ticket':
              count = ticket.length;
              break;

            default:
              count = booking.length + order.length + ticket.length;
              break;
          }

          return (
            <Block width={120} alignItems="center" justifyContent="center">
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                style={[styles.tab]}>
                <Block
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="row"
                  columnGap={8}>
                  <Text
                    fontStyle="Body16Reg"
                    colorTheme={focused ? 'neutral900' : 'neutral600'}
                    t18n={route.title as I18nKeys}
                  />
                  <Block
                    paddingHorizontal={8}
                    paddingVertical={2}
                    colorTheme="primary500"
                    borderRadius={28}>
                    <Text
                      text={count.toString()}
                      colorTheme="classicWhite"
                      fontStyle="Body12Med"
                    />
                  </Block>
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
    [booking.length, order.length, styles.tab, styles.tabBar, ticket.length],
  );

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (route.key) {
        case TabName.ALL:
          return <TabAll />;

        case TabName.ORDER:
          return <TabOrder />;

        case TabName.BOOKING:
          return <TabBooking />;

        case TabName.TICKET:
          return <TabTicket />;
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
      renderTabBar={renderTabBar}
      initialLayout={{ width: WindowWidth }}
      renderLazyPlaceholder={() => <LazyPlaceholder height={200} />}
      onIndexChange={setIndex}
    />
  );
};
