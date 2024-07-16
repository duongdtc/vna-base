/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-nested-ternary */
import { Block, Text } from '@vna-base/components';
import { FlightOfPassengerForm } from '@vna-base/screens/flight/type';
import { useTheme } from '@theme';
import { I18nKeys } from '@translations/locales';
import { scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import { AddAncillaryForm } from '../../type';
import { FlightItem } from './flight-item';

type ItemContainerProps = {
  t18nTitle: I18nKeys;
  renderSegment?: boolean;
  loading?: boolean;
  services?: Record<string, any>;
  renderServiceItem: (data: {
    passengerIndex: number;
    flightIndex: number;
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
  const { control } = useFormContext<AddAncillaryForm>();

  const flights = useWatch({
    control,
    name: 'flights',
  });

  const _renderServiceItem = useCallback(
    (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex?: number | undefined;
    }) =>
      renderServiceItem({
        ...data,
        isEmptyService: isEmpty(services![data.flightIndex]),
      }),
    [renderServiceItem, services],
  );

  const renderFlight = useCallback<ListRenderItem<FlightOfPassengerForm>>(
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
            data={flights}
            renderItem={renderFlight}
            scrollEnabled={false}
            keyExtractor={(_, index) => index.toString()}
          />
        )}
      </Block>
    </Block>
  );
};
