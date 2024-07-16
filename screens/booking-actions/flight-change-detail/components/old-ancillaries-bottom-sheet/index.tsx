import { Block, BottomSheet, LazyPlaceholder } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { SnapPoint, WindowWidth } from '@vna-base/utils';
import React, { forwardRef, memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { TabBar } from './tab-bar';
import { Tab } from './tab';
import { useFormContext, useWatch } from 'react-hook-form';
import { FlightChangeForm } from '../../type';

const TabName = {
  BAGGAGE: 'BAGGAGE',
  SERVICE: 'SERVICE',
  PRESEAT: 'PRESEAT',
};

export const OldAncillariesBottomSheet = memo(
  forwardRef<NormalRef, any>((_, ref) => {
    const { control } = useFormContext<FlightChangeForm>();
    const { baggages, preSeats, services } = useWatch({
      name: 'oldAncillaries',
      control,
    });

    const [index, setIndex] = useState<number>(0);

    const [routes] = useState([
      {
        key: TabName.BAGGAGE,
        title: 'flight_change_detail:baggages',
      },
      {
        key: TabName.SERVICE,
        title: 'flight_change_detail:other_services',
      },
      {
        key: TabName.PRESEAT,
        title: 'flight_change_detail:seats',
      },
    ]);

    const renderTabBar = useCallback(
      (
        props: SceneRendererProps & {
          navigationState: NavigationState<Route>;
        },
      ) => <TabBar {...props} />,
      [],
    );

    const renderScene = useCallback(
      ({
        route,
      }: SceneRendererProps & {
        route: Route;
      }) => {
        switch (route.key) {
          case TabName.PRESEAT:
            return <Tab ancillaries={preSeats} />;
          case TabName.BAGGAGE:
            return <Tab ancillaries={baggages} />;
          case TabName.SERVICE:
            return <Tab ancillaries={services} />;
        }
      },
      [],
    );

    return (
      <BottomSheet
        paddingBottom={false}
        ref={ref}
        enablePanDownToClose={false}
        typeBackDrop="gray"
        type="normal"
        useDynamicSnapPoint={false}
        snapPoints={[SnapPoint['50%']]}
        t18nTitle="flight_change_detail:view_old_ancillaries"
        showIndicator={false}>
        <Block flex={1} colorTheme="neutral50">
          <TabView
            navigationState={{ index, routes }}
            lazy
            swipeEnabled={false}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            initialLayout={{ width: WindowWidth }}
            renderLazyPlaceholder={() => <LazyPlaceholder height={160} />}
          />
        </Block>
      </BottomSheet>
    );
  }),
  isEqual,
);
