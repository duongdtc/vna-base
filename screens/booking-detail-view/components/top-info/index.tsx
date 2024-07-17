import {
  Block,
  BottomSheet,
  Icon,
  LinearGradient,
  TerminalView,
  Text,
} from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { PREFIX_BOOKING_VIEW } from '@env';
import { selectViewingBookingVersion } from '@vna-base/redux/selector';
import {
  ActiveOpacity,
  BookingStatus,
  BookingStatusDetails,
  SnapPoint,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

const test = `
AMMSUR
1.1CAO/THI BONG MS
1 VN1394R 25DEC M SGNUIH HK1  1515  1630  HRS /E
TKT/TIME LIMIT
1.T-24DEC-FDI4A3B
2.TE 7382405884137 CAO/T FDI4A3B 1456/24DEC
VCR COUPON DATA EXISTS  *VI TO DISPLAY
PHONES
1.FDI84-938181908-M ADMINISTRATOR
2.FDI84-938813891-M
PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL
PRICE QUOTE RECORD EXISTS - *PQS
PROFILE INDEX DATA EXISTS *PI TO DISPLAY ALL
SEATS/BOARDING PASS
1   1394R 25DEC SGNUIH HK 19D NA    P 1.1 CAO/THI BONG MS
VN FACTS
1.OSI VN BKCN02639
2.SSR OTHS  /ADV TKT BY 24DEC23 1515HANVN OR WL BE CXLD
REMARKS
1.TDINH
2.XXAUTH/182862   *Z/BT0003
RECEIVED FROM - ADMIN-HNH1384
OAC - VN FDI GS 3798000
FDI-FDI-GS.FDI4A10 0153/24DEC23 AMMSUR H
PRICE QUOTE RECORD - DETAILS

PQ 1  MVNDP1ADTRQ

BASE FARE                TAXES/FEES/CHARGES   TOTAL
VND729000                      628000XT     VND1357000ADT
XT     450000YR      59000UE      99000AX      20000C4
ADT  RPXVNF
LAST DAY TO PURCHASE 25DEC/0253
SGN VN UIH729000RPXVNF VND729000END
PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING
NON-END.RESTRICT MAY APPLY/CONTACT B4 DEPT FOR CHANGE
01 O SGN VN  1394R  25DEC  315P  RPXVNF           25DEC25DEC01P
UIH
FDI FDI 4A10 0153/24DEC STATUS-EXPIRED EXP-0208/24DEC PRICE-SYS
AMMSUR
1.1CAO/THI BONG MS
1 VN1394R 25DEC M SGNUIH HK1  1515  1630  HRS /E
TKT/TIME LIMIT
1.T-24DEC-FDI4A3B
2.TE 7382405884137 CAO/T FDI4A3B 1456/24DEC
VCR COUPON DATA EXISTS  *VI TO DISPLAY
PHONES
1.FDI84-938181908-M ADMINISTRATOR
2.FDI84-938813891-M
PASSENGER EMAIL DATA EXISTS  *PE TO DISPLAY ALL
PRICE QUOTE RECORD EXISTS - *PQS
PROFILE INDEX DATA EXISTS *PI TO DISPLAY ALL
SEATS/BOARDING PASS
1   1394R 25DEC SGNUIH HK 19D NA    P 1.1 CAO/THI BONG MS
VN FACTS
1.OSI VN BKCN02639
2.SSR OTHS  /ADV TKT BY 24DEC23 1515HANVN OR WL BE CXLD
REMARKS
1.TDINH
2.XXAUTH/182862   *Z/BT0003
RECEIVED FROM - ADMIN-HNH1384
OAC - VN FDI GS 3798000
FDI-FDI-GS.FDI4A10 0153/24DEC23 AMMSUR H
PRICE QUOTE RECORD - DETAILS

PQ 1  MVNDP1ADTRQ

BASE FARE                TAXES/FEES/CHARGES   TOTAL
VND729000                      628000XT     VND1357000ADT
XT     450000YR      59000UE      99000AX      20000C4
ADT  RPXVNF
LAST DAY TO PURCHASE 25DEC/0253
SGN VN UIH729000RPXVNF VND729000END
PRIVATE FARE APPLIED - CHECK RULES FOR CORRECT TICKETING
NON-END.RESTRICT MAY APPLY/CONTACT B4 DEPT FOR CHANGE
01 O SGN VN  1394R  25DEC  315P  RPXVNF           25DEC25DEC01P
UIH
FDI FDI 4A10 0153/24DEC STATUS-EXPIRED EXP-0208/24DEC PRICE-SYS
`;

export const TopInfo = ({ versionDate }: { versionDate: string }) => {
  const styles = useStyles();

  const booking = useSelector(selectViewingBookingVersion);

  const bookingViewBottomSheetRef = useRef<NormalRef>(null);

  const statusDetail =
    BookingStatusDetails[booking?.BookingStatus as BookingStatus];

  const isExpired = dayjs(booking?.ExpirationDate).isBefore(dayjs());

  return (
    <Block rowGap={16} paddingHorizontal={16}>
      <Block rowGap={4}>
        <Block flexDirection="row" alignItems="center" columnGap={2}>
          <Text
            fontStyle="Body12Med"
            colorTheme="neutral600"
            t18n="booking_version:version"
          />
          <Text
            fontStyle="Body12Med"
            colorTheme="neutral600"
            text={dayjs(versionDate).format('HH:mm DD/MM/YYYY')}
          />
        </Block>
        <Block flexDirection="row" columnGap={12}>
          <Block style={[styles.headerBtn, styles.stateBtn]}>
            <Block flexDirection="row" alignItems="center" columnGap={8}>
              <Icon
                icon={statusDetail?.icon}
                colorTheme={statusDetail?.iconColorTheme}
                size={16}
              />
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral900"
                t18n={statusDetail?.t18n}
              />
            </Block>
          </Block>
          <TouchableOpacity
            onPress={() => {
              bookingViewBottomSheetRef.current?.present();
            }}
            style={[styles.headerBtn, styles.actionBtn]}
            activeOpacity={ActiveOpacity}>
            <LinearGradient style={StyleSheet.absoluteFillObject} type="001" />
            <Icon icon="browser_outline" size={20} colorTheme="classicWhite" />
            <Text
              t18n="booking:booking_view"
              fontStyle="Body14Semi"
              colorTheme="classicWhite"
            />
          </TouchableOpacity>
        </Block>
        <BottomSheet
          useDynamicSnapPoint={false}
          ref={bookingViewBottomSheetRef}
          type="normal"
          snapPoints={[SnapPoint.Half]}
          showCloseButton={false}
          showIndicator={true}>
          <TerminalView
            useInBottomSheet={true}
            prefixExportName={PREFIX_BOOKING_VIEW}
            cb={() => {
              bookingViewBottomSheetRef.current?.dismiss();
            }}>
            <Text
              text={test}
              colorTheme="classicWhite"
              fontStyle="Body10SemiMono"
              style={{ lineHeight: 16 }}
            />
          </TerminalView>
        </BottomSheet>
      </Block>
      {!!booking?.TimePurchase ||
        (!!booking?.ExpirationDate && (
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Block flex={1} rowGap={4}>
              {booking.ExpirationDate && (
                <>
                  <Block flexDirection="row" alignItems="center" columnGap={4}>
                    <Text
                      t18n="booking:reservation_deadline"
                      fontStyle="Body12Med"
                      colorTheme="neutral600"
                    />
                    <Icon
                      icon="plane_timer_fill"
                      size={12}
                      colorTheme="neutral600"
                    />
                  </Block>
                  <Text
                    colorTheme={isExpired ? 'error600' : 'success600'}
                    fontStyle="Body16Reg">
                    {`${dayjs(booking.ExpirationDate).format('DD/MM/YYYY ')}`}
                    <Text
                      colorTheme={isExpired ? 'error600' : 'success600'}
                      fontStyle="Title16Bold"
                      text={dayjs(booking.ExpirationDate).format(' HH:mm')}
                    />
                  </Text>
                </>
              )}
            </Block>
            <Block flex={1} alignItems="flex-end" rowGap={4}>
              {booking.TimePurchase && (
                <>
                  <Block flexDirection="row" alignItems="center" columnGap={4}>
                    <Icon icon="timer_fill" size={12} colorTheme="neutral600" />
                    <Text
                      t18n="booking:price_hold_deadline"
                      fontStyle="Body12Med"
                      colorTheme="neutral600"
                    />
                  </Block>
                  <Text
                    colorTheme={isExpired ? 'error600' : 'primary600'}
                    fontStyle="Body16Reg">
                    {`${dayjs(booking.TimePurchase).format('DD/MM/YYYY ')}`}
                    <Text
                      colorTheme={isExpired ? 'error600' : 'primary600'}
                      fontStyle="Title16Bold"
                      text={dayjs(booking.TimePurchase).format(' HH:mm')}
                    />
                  </Text>
                </>
              )}
            </Block>
          </Block>
        ))}
    </Block>
  );
};
