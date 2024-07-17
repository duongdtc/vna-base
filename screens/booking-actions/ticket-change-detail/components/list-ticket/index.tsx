import { Block, Separator, Text } from '@vna-base/components';
import { selectCurrentFeature } from '@vna-base/redux/selector';
import { BookingRealm, TicketRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';

export const ListTicket = memo(() => {
  const { bookingId } = useSelector(selectCurrentFeature);

  const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    bookingId,
  );

  const _renderTicketItem = useCallback<ListRenderItem<TicketRealm>>(
    ({ item }) => (
      <Block
        flexDirection="row"
        alignItems="center"
        columnGap={12}
        paddingHorizontal={16}
        paddingVertical={12}>
        <Block flex={1}>
          <Text
            text={item.TicketNumber}
            fontStyle="Body12Bold"
            colorTheme="neutral900"
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            text={item.FullName}
            fontStyle="Body12Med"
            colorTheme="neutral600"
          />
        </Block>
        <Block alignItems="flex-end">
          <Text
            text={item.TicketType}
            fontStyle="Body12Bold"
            colorTheme="success500"
          />
          <Text
            text={`${item.StartPoint}-${item.EndPoint}`}
            fontStyle="Body12Reg"
            colorTheme="neutral600"
          />
        </Block>
      </Block>
    ),
    [],
  );

  return (
    <Block rowGap={8} paddingTop={8}>
      <Text
        t18n="exchange_ticket:exchange_tickets"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block
        colorTheme="neutral100"
        borderRadius={8}
        borderWidth={10}
        borderColorTheme="neutral200"
        overflow="hidden">
        <FlatList
          scrollEnabled={false}
          data={bookingDetail?.Tickets ?? []}
          keyExtractor={(item, index) => `${item?.Id}_${index}`}
          renderItem={_renderTicketItem}
          ItemSeparatorComponent={() => <Separator type="horizontal" />}
        />
      </Block>
    </Block>
  );
}, isEqual);
