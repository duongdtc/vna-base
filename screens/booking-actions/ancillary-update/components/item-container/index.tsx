/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Text } from '@vna-base/components';
import { selectCurrentFeature } from '@vna-base/redux/selector';
import { Flight } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { useTheme } from '@theme';
import { I18nKeys } from '@translations/locales';
import { scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';

import { useSelector } from 'react-redux';
import { FlightItem } from './flight-item';

type ItemContainerProps = {
  t18nTitle: I18nKeys;
  renderSegment?: boolean;
  loading?: boolean;
  services?: Record<string, any>;
  renderServiceItem: (data: {
    passengerIndex: number;
    flightIndex: number;
    isOneway: boolean;
    isEmptyService: boolean;
    segmentIndex?: number;
  }) => JSX.Element;
};

export const ItemContainer = (props: ItemContainerProps) => {
  const {
    t18nTitle,
    renderSegment = true,
    services,
    loading = false,
    renderServiceItem,
  } = props;
  const { colors } = useTheme();
  const { bookingId } = useSelector(selectCurrentFeature);
  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, bookingId);

  const _renderServiceItem = useCallback(
    (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex?: number | undefined;
    }) =>
      renderServiceItem({
        ...data,
        isOneway: bookingDetail?.Flights?.length !== 1,
        isEmptyService: isEmpty(services![data.flightIndex]),
      }),
    [renderServiceItem, services],
  );

  const renderFlight = useCallback<ListRenderItem<Flight>>(
    ({ item, index }) => (
      <FlightItem
        {...item}
        index={index}
        renderSegment={renderSegment}
        renderServiceItem={_renderServiceItem}
      />
    ),
    [_renderServiceItem, renderSegment],
  );

  return (
    <Block paddingTop={8} rowGap={8}>
      <Text fontStyle="Title20Semi" colorTheme="neutral900" t18n={t18nTitle} />
      <Block padding={12} colorTheme="neutral100" borderRadius={8}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.neutral800}
            style={{ marginVertical: scale(12) }}
          />
        ) : (
          <FlatList
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            data={bookingDetail?.Flights ?? []}
            renderItem={renderFlight}
            scrollEnabled={false}
            keyExtractor={(_, index) => index.toString()}
          />
        )}
      </Block>
    </Block>
  );
};
