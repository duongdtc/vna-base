import { Block, Icon, Separator, Text } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { DEFAULT_CURRENCY } from '@env';
import { selectViewingBookingVersion } from '@vna-base/redux/selector';
import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { TicketFareBottomSheet } from '../ticket-fare-bottom-sheet';
import { useStyles } from './styles';

export const Footer = memo(() => {
  const styles = useStyles();
  const bottomSheetRef = useRef<NormalRef>(null);

  const bookingDetail = useSelector(selectViewingBookingVersion);

  return (
    <>
      <Pressable
        onPress={() => {
          bottomSheetRef.current?.present();
        }}>
        <Block style={styles.containerBottom}>
          <Block flexDirection="row" alignItems="center">
            <Block flex={1} flexDirection="row" justifyContent="space-between">
              <Text
                t18n="booking:net_price"
                fontStyle="Body12Med"
                colorTheme="neutral800"
              />
              <Text
                text={(bookingDetail?.NetPrice ?? 0).currencyFormat()}
                fontStyle="Body14Semi"
                colorTheme="price"
              />
            </Block>
            <Separator
              type="vertical"
              height={16}
              marginHorizontal={8}
              colorTheme="neutral200"
            />
            <Block flex={1} flexDirection="row" justifyContent="space-between">
              <Text
                t18n="order:profit"
                fontStyle="Body12Med"
                colorTheme="neutral800"
              />
              <Text
                text={(bookingDetail?.Profit ?? 0).currencyFormat()}
                fontStyle="Body14Semi"
                colorTheme="success500"
              />
            </Block>
          </Block>
          <Block
            height={1}
            marginTop={8}
            marginBottom={12}
            colorTheme="neutral200"
          />
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Block flexDirection="row" alignItems="center" columnGap={2}>
                <Text
                  t18n="booking:total_price"
                  fontStyle="Body14Semi"
                  colorTheme="neutral800"
                />
                <Icon icon="info_outline" size={16} colorTheme="primary500" />
              </Block>
              <Block flex={1} alignItems="flex-end">
                <Text fontStyle="Title20Semi" colorTheme="price">
                  {`${(bookingDetail?.TotalPrice ?? 0).currencyFormat()}`}{' '}
                  <Text text={DEFAULT_CURRENCY} colorTheme="neutral800" />
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </Pressable>
      <TicketFareBottomSheet ref={bottomSheetRef} />
    </>
  );
}, isEqual);
