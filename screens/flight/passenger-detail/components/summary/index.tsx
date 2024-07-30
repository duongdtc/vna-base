import { Block, BottomSheet, LazyPlaceholder } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { SnapPoint, WindowWidth } from '@vna-base/utils';
import React, { forwardRef, memo, useCallback, useState } from 'react';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import {
  BaggageTab,
  HotelTab,
  InfoFareTab,
  InsuranceTravelTab,
  SeatTab,
  ServiceTab,
  // ShuttleBusTab,
  TabBar,
} from './components';
import { I18nKeys } from '@translations/locales';

const TabName = {
  INFO_FARE: 'INFO_FARE',
  SEAT: 'SEAT',
  BAGGAGE: 'BAGGAGE',
  SERVICE: 'SERVICE',
  SHUTTLE_BUS: 'SHUTTLE_BUS',
  HOTEL: 'HOTEL',
  ISSUERANCE: 'ISSUERANCE',
};

export const Summary = memo(
  forwardRef<NormalRef, any>((_, ref) => {
    const [index, setIndex] = useState<number>(0);

    const [routes] = useState([
      {
        key: TabName.INFO_FARE,
        title: 'input_info_passenger:ticket_info',
      },
      {
        key: TabName.SEAT,
        title: 'input_info_passenger:seat',
      },
      {
        key: TabName.BAGGAGE,
        title: 'input_info_passenger:baggage',
      },
      {
        key: TabName.SERVICE,
        title: 'input_info_passenger:others_services',
      },
      {
        key: TabName.SHUTTLE_BUS,
        title: 'Xe sân bay' as I18nKeys,
      },
      {
        key: TabName.HOTEL,
        title: 'Khách sạn' as I18nKeys,
      },
      {
        key: TabName.ISSUERANCE,
        title: 'Bảo hiểm' as I18nKeys,
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
          case TabName.INFO_FARE:
            return <InfoFareTab />;
          case TabName.SEAT:
            return <SeatTab />;
          case TabName.BAGGAGE:
            return <BaggageTab />;
          case TabName.SERVICE:
            return <ServiceTab />;
          // case TabName.SHUTTLE_BUS:
          //   return <ShuttleBusTab />;
          case TabName.HOTEL:
            return <HotelTab />;
          case TabName.ISSUERANCE:
            return <InsuranceTravelTab />;
        }
      },
      [],
    );

    return (
      <BottomSheet
        paddingBottom={false}
        useModal={false}
        ref={ref}
        enablePanDownToClose={false}
        typeBackDrop="gray"
        type="normal"
        useDynamicSnapPoint={false}
        snapPoints={[SnapPoint.Half]}
        t18nTitle="common:detail"
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
  () => true,
);
