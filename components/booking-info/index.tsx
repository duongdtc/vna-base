import { IconTypes } from '@assets/icon';
import { Block, Icon, LinearGradient, Text, showToast } from '@vna-base/components';
import { BlockProps } from '@vna-base/components/block/type';
import { LOGO_URL } from '@env';
import Clipboard from '@react-native-clipboard/clipboard';
import { Booking } from '@services/axios/axios-ibe';
import { AirlineRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { useTheme } from '@theme';
import { I18nKeys } from '@translations/locales';
import { translate } from '@translations/translate';
import {
  ActiveOpacity,
  BookingStatus,
  BookingStatusDetails,
  System,
  SystemDetails,
  WindowWidth,
} from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { Circle, Line, Svg, SvgUri } from 'react-native-svg';
import { useStyles } from './style';

type Props = Pick<
  Booking,
  'Airline' | 'BookingCode' | 'System' | 'BookingStatus'
> &
  BlockProps;

export const BookingInfo = memo((props: Props) => {
  const {
    BookingCode,
    System,
    Airline,
    BookingStatus: bookingStatus,
    ...blockProps
  } = props;

  const { colors } = useTheme();
  const styles = useStyles();

  const airline = Airline
    ? realmRef.current?.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        Airline,
      )?.NameEn
    : '';

  const status = useMemo(
    () => BookingStatusDetails[bookingStatus as BookingStatus],
    [bookingStatus],
  );

  return (
    <Block
      width={WindowWidth - 24}
      colorTheme="neutral100"
      borderRadius={12}
      style={{ marginTop: 39 }}
      {...blockProps}>
      <Block
        colorTheme="neutral100"
        alignSelf="center"
        style={styles.logoContainer}>
        <LinearGradient type="003" style={styles.linearContainer}>
          <Block colorTheme="neutral200" style={styles.blockSvgUri}>
            <Block style={styles.svgUriContainer}>
              {Airline && (
                <SvgUri
                  width={'100%'}
                  height={'100%'}
                  uri={LOGO_URL + Airline + '.svg'}
                />
              )}
            </Block>
          </Block>
        </LinearGradient>
      </Block>
      <Block alignItems="center" rowGap={8}>
        <Text
          text={`${airline ?? ''} - ${Airline ?? ''}`}
          fontStyle="Title16Semi"
          colorTheme="neutral900"
        />
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Icon
            icon={status?.icon as IconTypes}
            size={12}
            colorTheme={status?.iconColorTheme}
          />
          <Text
            t18n={status?.t18n as I18nKeys}
            fontStyle="Capture11Reg"
            colorTheme="neutral900"
          />
        </Block>
        <Block
          borderRadius={4}
          paddingHorizontal={12}
          paddingVertical={4}
          colorTheme={SystemDetails[System as System]?.colorTheme}>
          <Text fontStyle="Capture11Reg" colorTheme="classicWhite">
            {`${translate('system:system')}: `}
            <Text
              text={System as string}
              fontStyle="Capture11Bold"
              colorTheme="classicWhite"
            />
          </Text>
        </Block>
      </Block>
      <Svg height={25} width={WindowWidth - 24}>
        <Circle cx="0" cy="12" r="10" fill={colors.neutral50} />
        <Line
          key={Math.random()}
          x1={0}
          y1={12}
          x2={WindowWidth - 24}
          y2={12}
          stroke={colors.neutral50}
          strokeDasharray="5, 5"
          strokeWidth={2}
        />
        <Circle cx={WindowWidth - 24} cy="12" r="10" fill={colors.neutral50} />
      </Svg>
      <Block
        paddingHorizontal={12}
        style={styles.footerContainer}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Icon icon="price_tag_fill" size={16} colorTheme="neutral700" />
          <Text
            t18n="book_flight_done:booking_code"
            fontStyle="Body12Reg"
            colorTheme="neutral600"
          />
        </Block>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => {
            Clipboard.setString(BookingCode ?? '');
            showToast({
              type: 'success',
              t18n: 'order_detail:copy_booking_code_success',
            });
          }}>
          <Block flexDirection="row" alignItems="center" columnGap={8}>
            <Text
              text={BookingCode!}
              fontStyle="Title20Bold"
              colorTheme="success600"
            />
            <Icon icon="fi_sr_copy_alt" size={16} colorTheme="neutral300" />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block>
  );
}, isEqual);
