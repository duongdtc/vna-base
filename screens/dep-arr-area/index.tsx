import {
  Block,
  Button,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HitSlop, WindowWidth } from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import React, { useCallback, useState } from 'react';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { AirportTab, AreaTab, TabBar } from './components';
import { useStyles } from './style';

const TabName = {
  AIRPORT: 'AIRPORT',
  AREA: 'AREA',
};

export const DepArrArea = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.DEP_ARR_AREA>) => {
  const { onDone, selected, t18n } = route.params;
  const styles = useStyles();

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: TabName.AIRPORT,
      title: 'dep_arr_area:airport',
    },
    {
      key: TabName.AREA,
      title: 'dep_arr_area:area',
    },
  ]);

  const renderScene = useCallback(
    ({
      route: r,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (r.key) {
        case TabName.AIRPORT:
          return <AirportTab onDone={onDone} selected={selected} />;
        case TabName.AREA:
          return <AreaTab onDone={onDone} selected={selected} />;
      }
    },
    [],
  );

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      },
    ) => <TabBar {...props} />,
    [],
  );

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral100"
        zIndex={0}
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            t18n={t18n ?? 'dep_arr_area:select_area'}
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <Block flex={1}>
        <TabView
          navigationState={{ index, routes }}
          swipeEnabled={false}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: WindowWidth }}
          renderTabBar={renderTabBar}
        />
      </Block>
    </Screen>
  );
};
