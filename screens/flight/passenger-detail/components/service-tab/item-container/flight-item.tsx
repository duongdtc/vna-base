/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block } from '@vna-base/components';
import { FlightOfPassengerForm } from '@vna-base/screens/flight/type';
import { Segment } from '@services/axios/axios-ibe';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList } from 'react-native';
import { SegmentItem } from './segment-item';
import { I18nKeys } from '@translations/locales';
import { useStyles, createStyleSheet } from '@theme';
import { HairlineWidth } from '@vna-base/utils';

export const FlightItem = memo(
  ({
    hideHeader,
    renderSegment,
    ListSegment,
    Airline,
    ArriveDate,
    DepartDate,
    Duration,
    EndDate,
    EndPoint,
    FlightNumber,
    Leg,
    Operator,
    StartDate,
    StartPoint,
    isEmptyService,
    onPressSegmentPreSeat,
    renderServiceItem,
    t18nEmpty,
    index: flightIndex,
  }: FlightOfPassengerForm & {
    renderSegment: boolean;
    hideHeader: boolean;
    /**
     * default false
     */
    isEmptyService: boolean;
    t18nEmpty?: I18nKeys;
    index: number;
    onPressSegmentPreSeat:
      | ((flightIdx: number, segmentIdx: number) => void)
      | null;

    renderServiceItem: (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex?: number | undefined;
    }) => JSX.Element;
  }) => {
    const { styles } = useStyles(styleSheet);

    const listSegment: Array<Segment> = renderSegment
      ? ListSegment!
      : ([
          {
            Airline,
            ArriveDate,
            DepartDate,
            Duration,
            EndDate,
            EndPoint,
            FlightNumber,
            Leg,
            Operator,
            StartDate,
            StartPoint,
          },
        ] as Array<Segment>);

    const _renderServiceItem = (data: {
      passengerIndex: number;
      segmentIndex?: number | undefined;
    }) => renderServiceItem({ ...data, flightIndex });

    const _onPressSegmentPreSeat = (segmentIdx: number) =>
      onPressSegmentPreSeat?.(flightIndex, segmentIdx);

    return (
      <Block
        style={[
          hideHeader
            ? styles.flightItemContainerNoWrap
            : styles.flightItemContainer,
          !hideHeader && styles.flightItemContainerCommon,
        ]}>
        <FlatList
          data={listSegment}
          keyExtractor={(item, index) => `${item.SegmentId}_${index}`}
          renderItem={({ item, index }) => (
            <SegmentItem
              {...item}
              hideHeader={hideHeader}
              isEmptyService={isEmptyService}
              onPressSegmentPreSeat={
                !!onPressSegmentPreSeat ? _onPressSegmentPreSeat : null
              }
              renderServiceItem={_renderServiceItem}
              t18nEmpty={t18nEmpty}
              index={index}
            />
          )}
        />
      </Block>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  flightItemContainerCommon: { marginBottom: spacings[12] },
  flightItemContainer: {
    borderRadius: 8,
    borderWidth: HairlineWidth * 3,
    overflow: 'hidden',
    borderColor: colors.neutral20,
  },
  flightItemContainerNoWrap: {},
}));
