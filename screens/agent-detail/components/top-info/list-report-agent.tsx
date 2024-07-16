import { Block } from '@vna-base/components';
import { selectResultListFLReport } from '@redux-selector';
import { ListKeyFlReport, ReportAgt } from '@vna-base/screens/agent-detail/type';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemReportAgt } from './item-report';

export const ListReportAgent = memo(() => {
  const listFlReport = useSelector(selectResultListFLReport);

  const ListReportAgt: Array<ReportAgt> = [
    {
      key: ListKeyFlReport.ORDERS,
      t18n: 'bottom_tab_nav:orders',
      totalCount: listFlReport?.List?.[0]?.OrderTotal?.currencyFormat() ?? '0',
      currency: 'agent:order',
    },
    {
      key: ListKeyFlReport.SALES,
      t18n: 'agent:sales',
      totalCount:
        Math.round(
          listFlReport?.List?.[0]?.Revenue
            ? listFlReport?.List?.[0]?.Revenue / 1000000
            : 0,
        )?.currencyFormat() ?? '0',
      currency: 'agent:million',
    },
    {
      key: ListKeyFlReport.SEARCH,
      t18n: 'common:search',
      totalCount: listFlReport?.List?.[0]?.SearchTotal?.currencyFormat() ?? '0',
      currency: 'agent:times',
    },
    {
      key: ListKeyFlReport.RESERVE,
      t18n: 'input_info_passenger:reservations',
      totalCount: listFlReport?.List?.[0]?.BookTotal?.currencyFormat() ?? '0',
      currency: 'agent:times',
    },
    {
      key: ListKeyFlReport.ISSUE_TICKET,
      t18n: 'book_flight_done:issue_ticket',
      totalCount: listFlReport?.List?.[0]?.TicketIssue?.currencyFormat() ?? '0',
      currency: 'agent:times',
    },
  ];

  const renderItem = useCallback<ListRenderItem<ReportAgt>>(({ item }) => {
    return <ItemReportAgt item={item} />;
  }, []);

  return (
    <FlatList
      data={ListReportAgt}
      keyExtractor={(item, index) => `${item.key}_${index}`}
      renderItem={renderItem}
      horizontal
      ItemSeparatorComponent={() => <Block width={8} />}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      showsHorizontalScrollIndicator={false}
      style={{ paddingTop: 4 }}
    />
  );
}, isEqual);
