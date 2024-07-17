/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, EmptyList, Text } from '@vna-base/components';
import { selectViewingBookingVersion } from '@vna-base/redux/selector';
import { Ticket } from '@services/axios/axios-data';
import { System, SystemDetails } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './style';

export const TicketsTab = memo(() => {
  const styles = useStyles();

  const bookingDetail = useSelector(selectViewingBookingVersion);

  const renderItem = useCallback<ListRenderItem<Ticket>>(({ item, index }) => {
    const color = SystemDetails[item.System as System].colorTheme;
    return (
      <Block
        borderTopRadius={index === 0 ? 8 : 0}
        borderBottomRadius={
          index === (bookingDetail?.Tickets?.length ?? 0) - 1 ? 8 : 0
        }
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
            //@ts-ignore
            colorTheme={color.match(/[a-zA-Z]+/) + '50'}>
            <Text
              text={item.System as string}
              fontStyle="Capture11Bold"
              colorTheme={color}
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
            text={item.TicketStatus as string}
            fontStyle="Body12Bold"
            colorTheme="success500"
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
