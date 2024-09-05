import { Block, LazyPlaceholder, Text } from '@vna-base/components';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, WindowWidth } from '@vna-base/utils';
import React, { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';

import { useStyles } from './style';
import { AccountsTab, GeneralTab } from './components';

const TabName = {
  GENERAL: 'GENERAL',
  // CONFIG: 'CONFIG',
  ACCOUNT: 'ACCOUNT',
  // EMPLOYEE: 'EMPLOYEE',
  // DOCUMENT: 'DOCUMENT',
  // ACTIVITY: 'ACTIVITY',
};

export const TabContentAgentDetail = () => {
  const styles = useStyles();

  const [index, setIndex] = useState(0);

  const routes = useMemo(() => {
    const temp = [
      {
        key: TabName.GENERAL,
        title: 'agent:general_info',
      },
      // {
      //   key: TabName.CONFIG,
      //   title: 'agent:configuration',
      // },
      {
        key: TabName.ACCOUNT,
        title: 'agent:accounts',
      },
      // {
      //   key: TabName.EMPLOYEE,
      //   title: 'agent:employees',
      // },
      // {
      //   key: TabName.DOCUMENT,
      //   title: 'agent:document',
      // },
      // {
      //   key: TabName.ACTIVITY,
      //   title: 'user_account:activities',
      // },
    ];

    return temp;
  }, []);

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
        gap={8}
        scrollEnabled
        renderLabel={({ route, focused }) => {
          return (
            <Block width={130}>
              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                style={[styles.tab]}>
                <Text
                  fontStyle="Body16Reg"
                  colorTheme={focused ? 'neutral900' : 'neutral600'}
                  t18n={route.title as I18nKeys}
                />
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
        case TabName.GENERAL:
          return <GeneralTab />;

        // case TabName.CONFIG:
        //   return <ConfigTab />;

        case TabName.ACCOUNT:
          return <AccountsTab />;

        // case TabName.EMPLOYEE:
        //   return <EmployeesTab />;

        // case TabName.DOCUMENT:
        //   return <DocumentsTab />;

        // case TabName.ACTIVITY:
        //   return <ActivitiesTab />;
      }
    },
    [],
  );

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
      initialLayout={{ width: WindowWidth }}
      renderLazyPlaceholder={() => <LazyPlaceholder height={200} />}
    />
  );
};
