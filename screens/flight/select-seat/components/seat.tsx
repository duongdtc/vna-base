import { Block, Icon, Text } from '@vna-base/components';
import { SeatProps, SeatType } from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';

export const Seat = memo(
  ({
    item,
    selectedIndex,
    styles,
    disable,
    isSelectForCurrentPassenger,
    onSelectSeat,
  }: SeatProps) => {
    switch (item.SeatType) {
      case SeatType.WN:
        return (
          <Block
            height={28}
            width={28}
            borderRightRadius={10}
            borderColorTheme="neutral100"
          />
        );

      case SeatType.WL:
        return (
          <Block
            height={28}
            width={28}
            borderRightWidth={10}
            borderColorTheme="primary500"
          />
        );

      case SeatType.WR:
        return (
          <Block
            height={28}
            width={28}
            borderLeftWidth={10}
            borderColorTheme="primary500"
          />
        );

      case SeatType.AN:
        return <Block style={styles.seatContainer} />;

      case SeatType.A:
        return (
          <Block style={styles.seatContainer} paddingVertical={4}>
            <Text
              text={item.RowNumber?.toString()}
              fontStyle="Capture11Reg"
              colorTheme="neutral900"
            />
          </Block>
        );

      case SeatType.CLN:
        return (
          <Block style={styles.seatContainer} paddingVertical={4}>
            <Text
              text={item.ColumnCode?.toString()}
              fontStyle="Body14Bold"
              colorTheme="neutral900"
            />
          </Block>
        );

      case SeatType.S:
        if (!item.Enabled) {
          return (
            <Block style={[styles.seatContainer, styles.disableSeat]}>
              <Icon icon="close_outline" size={28} colorTheme="neutral50" />
            </Block>
          );
        }

        return (
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            disabled={disable}
            onPress={() => {
              if (isSelectForCurrentPassenger) {
                onSelectSeat(item);
              } else if (selectedIndex !== -1) {
                onSelectSeat(null, selectedIndex);
              } else {
                onSelectSeat(item);
              }
            }}
            style={[
              styles.seatContainer,
              selectedIndex !== -1 ? styles.selectedSeat : styles.enableSeat,
            ]}>
            <Text
              text={
                selectedIndex !== -1
                  ? (selectedIndex + 1).toString()
                  : item.SeatNumber ?? ''
              }
              fontStyle={selectedIndex !== -1 ? 'Body12Reg' : 'Body10Semi'}
              colorTheme={selectedIndex !== -1 ? 'neutral100' : 'white'}
            />
          </TouchableOpacity>
        );

      default:
        return <Block style={styles.seatContainer} />;
    }
  },
  (pre, next) =>
    pre.selectedIndex === next.selectedIndex &&
    pre.disable === next.disable &&
    pre.isSelectForCurrentPassenger === next.isSelectForCurrentPassenger,
);
