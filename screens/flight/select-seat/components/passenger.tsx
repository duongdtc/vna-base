import { Block, Icon, Text } from '@vna-base/components';
import { PassengerProps } from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import React, { memo, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useStyles } from '../styles';
import isEqual from 'react-fast-compare';

export const Passenger = memo(
  ({
    selectedSeat,
    selecting,
    index,
    fullName,
    setSelectingPassenger,
  }: PassengerProps) => {
    const styles = useStyles();
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
      if (!selecting && showDetail) {
        setShowDetail(false);
      }
    }, [selecting, showDetail]);

    return (
      <>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => {
            if (!selecting) {
              setSelectingPassenger(index);
            }

            setShowDetail(pre => !pre);
          }}
          style={[
            styles.passengerItemContainer,
            selecting && styles.selectedPassengerItem,
          ]}>
          <Text
            fontStyle="Capture11Bold"
            colorTheme="neutral900"
            text={`${index + 1}. ${fullName}`}
          />
          {selectedSeat ? (
            <Block
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Block flexDirection="row" alignItems="center" columnGap={4}>
                <Icon
                  icon="flight_seat_fill"
                  colorTheme="neutral800"
                  size={20}
                />
                <Text
                  text={selectedSeat.SeatNumber as string}
                  colorTheme="success500"
                  fontStyle="Body14Semi"
                />
              </Block>
              <Text
                text={selectedSeat.Price?.currencyFormat()}
                colorTheme="price"
                fontStyle="Body14Semi"
              />
            </Block>
          ) : (
            <Text
              fontStyle="Body14Reg"
              colorTheme="neutral700"
              t18n="select_seat:please_choose_a_seat"
            />
          )}
        </TouchableOpacity>
        {showDetail && selecting && selectedSeat && (
          <Block
            position="absolute"
            top={56}
            alignItems="center"
            shadow="medium">
            <Block
              padding={8}
              borderRadius={10}
              colorTheme="neutral100"
              minWidth={160}>
              <Text
                t18n="common:limit"
                fontStyle="Body12Bold"
                colorTheme="neutral900"
              />
              <Block marginTop={4} rowGap={2} marginLeft={4}>
                {selectedSeat.Limitations?.map((txt, idx) => (
                  <Text
                    key={idx}
                    text={txt ?? ''}
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                ))}
              </Block>
            </Block>
          </Block>
        )}
      </>
    );
  },
  (pre, next) =>
    isEqual(pre.selectedSeat, next.selectedSeat) &&
    pre.selecting === next.selecting,
);
