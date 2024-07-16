/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block } from '@vna-base/components';
import { Flight, Segment } from '@services/axios/axios-data';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList } from 'react-native';
import { SegmentItem } from './segment-item';
import { useStyles } from './styles';

export const FlightItem = memo(
  ({
    renderSegment,
    Segments,
    onPressSegmentPreSeat,
    renderServiceItem,
    index: flightIndex,
    Id,
    FlightId,
    Leg,
    Airline,
    Operator,
    StartPoint,
    EndPoint,
    DepartDate,
    ArriveDate,
    FlightNumber,
    Duration,
  }: Flight & {
    renderSegment: boolean;
    index: number;
    onPressSegmentPreSeat: (flightIdx: number, segmentIdx: number) => void;

    renderServiceItem: (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex: number;
    }) => JSX.Element;
  }) => {
    const styles = useStyles();

    const listSegment: Array<Segment> = renderSegment
      ? Segments!
      : ([
          {
            Id,
            FlightId,
            Leg,
            Airline,
            Operator,
            StartPoint,
            EndPoint,
            DepartDate,
            ArriveDate,
            FlightNumber,
            Duration,
          },
        ] as Array<Segment>);

    const _renderServiceItem =
      (segmentIndex: number) => (passengerIndex: number) =>
        renderServiceItem({ passengerIndex, segmentIndex, flightIndex });

    return (
      <Block style={styles.flightItemContainer}>
        <FlatList
          data={listSegment}
          keyExtractor={(item, index) => `${item.SegmentId}_${index}`}
          renderItem={({ item, index }) => (
            <SegmentItem
              {...item}
              onPressSegmentPreSeat={() => {
                onPressSegmentPreSeat(flightIndex, index);
              }}
              renderServiceItem={_renderServiceItem(index)}
            />
          )}
        />
      </Block>
    );
  },
  isEqual,
);
