import { Block, Button, Icon, NormalHeader, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { selectViewingBookingVersion } from '@redux-selector';
import { AirlineRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { HitSlop, System, SystemDetails } from '@vna-base/utils';
import React from 'react';
import { useSelector } from 'react-redux';

export const Header = () => {
  const booking = useSelector(selectViewingBookingVersion);

  const airline = booking?.Airline
    ? realmRef.current?.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        booking?.Airline,
      )?.NameEn
    : '';

  return (
    <>
      <NormalHeader
        zIndex={0}
        leftContentStyle={{ flex: 1 }}
        colorTheme="neutral100"
        leftContent={
          <Block flexDirection="row" alignItems="center">
            <Block
              flex={1}
              flexDirection="row"
              alignItems="center"
              columnGap={8}>
              <Button
                hitSlop={HitSlop.Large}
                leftIcon="arrow_ios_left_outline"
                leftIconSize={24}
                textColorTheme="neutral900"
                onPress={() => {
                  goBack();
                }}
                padding={4}
              />
              <Block rowGap={2}>
                <Text
                  text={`${booking?.Airline}: ${
                    booking?.BookingCode ?? 'FAIL'
                  }`}
                  colorTheme={!booking?.BookingCode ? 'error500' : 'success600'}
                  fontStyle="Title20Semi"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon="navigation_2_fill"
                    colorTheme="neutral800"
                    size={10}
                  />
                  <Text
                    text={airline}
                    colorTheme="neutral800"
                    fontStyle="Capture11Reg"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  />
                </Block>
              </Block>
            </Block>
            <Block
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={4}
              marginHorizontal={16}
              colorTheme={
                booking?.System
                  ? SystemDetails[booking.System as System]?.colorTheme
                  : 'neutral100'
              }>
              <Text
                text={booking?.System ?? ''}
                fontStyle="Capture11Bold"
                colorTheme="classicWhite"
              />
            </Block>
          </Block>
        }
      />
    </>
  );
};
