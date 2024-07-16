/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block } from '@vna-base/components';
import { Segment } from '@services/axios/axios-ibe';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList } from 'react-native';
import { SegmentItem } from './segment-item';
import { useStyles } from './styles';
import { Flight } from '@services/axios/axios-data';

export const FlightItem = memo(
  ({
    renderSegment,
    Segments,
    Airline,
    ArriveDate,
    DepartDate,
    Duration,
    EndPoint,
    FlightNumber,
    Leg,
    Operator,
    StartPoint,
    renderServiceItem,
    index: flightIndex,
  }: Flight & {
    renderSegment: boolean;
    index: number;
    renderServiceItem: (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex?: number | undefined;
    }) => JSX.Element;
  }) => {
    const styles = useStyles();

    const listSegment: Array<Segment> = renderSegment
      ? Segments!
      : ([
          {
            Airline,
            ArriveDate,
            DepartDate,
            Duration,
            EndPoint,
            FlightNumber,
            Leg,
            Operator,
            StartPoint,
          },
        ] as Array<Segment>);

    const _renderServiceItem = (data: {
      passengerIndex: number;
      segmentIndex?: number | undefined;
    }) => renderServiceItem({ ...data, flightIndex });

    return (
      <Block style={styles.flightItemContainer}>
        <FlatList
          data={listSegment}
          keyExtractor={(item, index) => `${item.SegmentId}_${index}`}
          renderItem={({ item, index }) => (
            <SegmentItem
              {...item}
              renderServiceItem={_renderServiceItem}
              index={index}
            />
          )}
        />
      </Block>
    );
  },
  isEqual,
);
