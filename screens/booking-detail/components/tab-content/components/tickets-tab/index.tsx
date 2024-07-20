/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, EmptyList, Text } from '@vna-base/components';
import { selectViewingBookingId } from '@vna-base/redux/selector';
import { Booking, Ticket } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import {
  System,
  SystemDetails,
  TicketTypeDetails,
  TicketType,
} from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './style';

export const TicketsTab = memo(() => {
  const styles = useStyles();

  const bookingId = useSelector(selectViewingBookingId);

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId!,
  )?.toJSON() as Booking;

  const renderItem = useCallback<ListRenderItem<Ticket>>(({ item, index }) => {
    const color = SystemDetails[item.System as System].colorTheme;
    return (
      <Block
        borderTopRadius={index === 0 ? 8 : 0}
        //@ts-ignore
        borderBottomRadius={index === bookingDetail.Tickets?.length - 1 ? 8 : 0}
        flexDirection="row"
        alignItems="center"
        colorTheme="neutral100"
        paddingVertical={12}
        paddingHorizontal={16}
        justifyContent="space-between">
        <Block flexDirection="row" alignItems="center" columnGap={12}>
          <Block
            width={32}
            height={32}
            alignItems="center"
            justifyContent="center"
            borderRadius={4}
            colorTheme={color}>
            <Text
              text={item.System as string}
              fontStyle="Capture11Bold"
              colorTheme={'white'}
            />
          </Block>
          <Block>
            <Text
              text={item.TicketNumber?.toString()}
              fontStyle="Body12Bold"
              colorTheme="neutral900"
            />
            <Text
              text={item.FullName?.toString()}
              fontStyle="Body12Med"
              colorTheme="neutral600"
            />
          </Block>
        </Block>
        <Block alignItems="flex-end">
          <Text
            text={TicketTypeDetails[item.TicketType as TicketType]?.t18n}
            fontStyle="Body12Bold"
            colorTheme={
              TicketTypeDetails[item.TicketType as TicketType]?.colorTheme
            }
          />
          <Text
            text={`${item.StartPoint} - ${item.EndPoint}`}
            fontStyle="Body12Reg"
            colorTheme="neutral600"
          />
        </Block>
      </Block>
    );
  }, []);

  if (isEmpty(bookingDetail?.Tickets)) {
    return (
      <EmptyList
        height={500}
        image="emptyListFlight"
        imageStyle={{ width: 192, height: 101 }}
        t18nTitle="common:no_data"
      />
    );
  }

  return (
    <Block flex={1}>
      <FlatList
        data={bookingDetail?.Tickets ?? []}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Id}_${index}`}
        ItemSeparatorComponent={() => (
          <Block height={1} colorTheme="neutral50" />
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </Block>
  );
}, isEqual);
