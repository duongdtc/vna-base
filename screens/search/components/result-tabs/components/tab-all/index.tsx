import { Block, EmptyList, Text } from '@vna-base/components';
import { selectResultSearch } from '@vna-base/redux/selector';
import { BookingItem } from '@vna-base/screens/booking/components';
import { Item } from '@vna-base/screens/flight-ticket/components';
import { OrderItem } from '@vna-base/screens/order/components';
import { Booking, Order, Ticket } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { scale } from '@vna-base/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { SectionList, SectionListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';

export const TabAll = memo(() => {
  const {
    Booking: booking,
    Order: order,
    Ticket: ticket,
  } = useSelector(selectResultSearch);

  const resultAll: Array<{
    t18n: I18nKeys;
    data: Array<Order | Booking | Ticket>;
  }> = [];

  if (order.length > 0) {
    resultAll.push({
      t18n: 'search:order',
      data: order,
    });
  }

  if (booking.length > 0) {
    resultAll.push({
      t18n: 'search:booking',
      data: booking,
    });
  }

  if (ticket.length > 0) {
    resultAll.push({
      t18n: 'search:ticket',
      data: ticket,
    });
  }

  const renderItem = useCallback<
    SectionListRenderItem<Order | Booking | Ticket>
  >(({ item, section: { t18n } }) => {
    switch (t18n) {
      case 'search:order':
        return (
          <OrderItem
            item={item as Order}
            id=""
            // customStyle={{ borderRadius: scale(12), overflow: 'hidden' }}
          />
        );

      case 'search:booking':
        return (
          <Block paddingHorizontal={12}>
            <BookingItem
              item={item as Booking}
              id=""
              customStyle={{ borderRadius: scale(12), overflow: 'hidden' }}
            />
          </Block>
        );

      case 'search:ticket':
        return (
          <Block paddingHorizontal={12}>
            <Item item={item as Ticket} />
          </Block>
        );

      default:
        return null;
    }
  }, []);

  return (
    <SectionList
      sections={resultAll}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => `${item.Index}_${item.Id}`}
      renderItem={renderItem}
      renderSectionHeader={({ section: { t18n } }) => (
        <Block paddingTop={16} paddingBottom={8} paddingHorizontal={12}>
          <Text t18n={t18n} fontStyle="Title20Semi" colorTheme="neutral900" />
        </Block>
      )}
      // contentContainerStyle={{ paddingHorizontal: scale(12) }}
      ItemSeparatorComponent={() => <Block height={8} />}
      ListEmptyComponent={
        <EmptyList
          t18nTitle="search:no_data"
          height={500}
          image="emptyListFlight"
          imageStyle={{ width: 192, height: 101 }}
        />
      }
      stickySectionHeadersEnabled={false}
    />
  );
}, isEqual);
