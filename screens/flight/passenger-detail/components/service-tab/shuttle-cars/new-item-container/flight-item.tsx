/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Segment } from '@services/axios/axios-ibe';
import { createStyleSheet, useStyles } from '@theme';
import { Block } from '@vna-base/components';
import { FlightOfPassengerForm } from '@vna-base/screens/flight/type';
import { HairlineWidth } from '@vna-base/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList } from 'react-native';
import { SegmentItem } from './segment-item';

export const FlightItem = memo(
  ({
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
    renderServiceItem,
    index: flightIndex,
    airportIdx,
    onCheckRound,
  }: FlightOfPassengerForm & {
    index: number;
    airportIdx: number;
    renderServiceItem: (data: {
      flightIndex: number;
      airportIdx: number;
    }) => JSX.Element;
    onCheckRound: ({
      round,
      flightIndex,
      airportIdx,
    }: {
      round: boolean;
      flightIndex: number;
      airportIdx: number;
    }) => void;
  }) => {
    const { styles } = useStyles(styleSheet);

    const listSegment: Array<Segment> = [
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
    ] as Array<Segment>;

    const _renderServiceItem = () =>
      renderServiceItem({ flightIndex, airportIdx });

    const _onCheckRound = useCallback(
      (data: { round: boolean; airportIdx: number }) => {
        onCheckRound({ ...data, flightIndex });
      },
      [flightIndex, onCheckRound],
    );

    return (
      <Block
        style={[styles.flightItemContainer, styles.flightItemContainerCommon]}>
        <FlatList
          data={listSegment}
          keyExtractor={(item, index) => `${item.SegmentId}_${index}`}
          renderItem={({ item }) => (
            <SegmentItem
              {...item}
              renderServiceItem={_renderServiceItem}
              index={flightIndex}
              onCheckRound={_onCheckRound}
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
