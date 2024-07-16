/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block } from '@vna-base/components/block';
import { LazyPlaceholder } from '@vna-base/components/lazy-placeholder';

import { selectViewingOrderId } from '@redux-selector';
import { EmailForm } from '@vna-base/screens/order-email/type';
import { BookingRealm } from '@services/realm/models/booking';
import { OrderRealm } from '@services/realm/models/order';
import { useRealm } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import { EmailType, WindowWidth } from '@vna-base/utils';
import React, { useCallback, useMemo, useState } from 'react';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import { EmailTab } from './email-tab';
import { ETicketTab } from './eticket-tab';
import { TabBar } from './tab-bar';

const TabName = {
  EMAIL: 'EMAIL',
};

export const PreviewEmail = ({ formData }: { formData: EmailForm }) => {
  const viewingOrderId = useSelector(selectViewingOrderId);

  const realm = useRealm();

  const orderDetail = realm.objectForPrimaryKey<OrderRealm>(
    OrderRealm.schema.name,
    viewingOrderId!,
  );

  const [index, setIndex] = useState<number>(0);

  const routes = useMemo(() => {
    const r: Array<{ key: string; t18n: I18nKeys }> = [
      {
        key: TabName.EMAIL,
        t18n: 'input_info_passenger:ticket_info',
      },
    ];

    if (formData.emailType === EmailType.ORDER_CONFIRM) {
      orderDetail?.Bookings?.forEach(id => {
        const bk = realm.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, id);

        r.push({
          key: id,

          t18n: `E-ticket ${bk?.Airline}-${bk?.StartPoint}${bk?.EndPoint}` as I18nKeys,
        });
      });
    }

    return r;
  }, [formData.emailType]);

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (route.key) {
        case TabName.EMAIL:
          return <EmailTab />;

        default:
          return <ETicketTab bookingId={route.key} />;
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

  if (formData.emailType !== EmailType.ORDER_CONFIRM) {
    return (
      <Block flex={1} colorTheme="neutral100">
        <EmailTab />
      </Block>
    );
  }

  return (
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
  );
};
