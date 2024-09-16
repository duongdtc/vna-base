/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Icon, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { selectLanguage } from '@vna-base/redux/selector';
import { Flight } from '@services/axios/axios-data';
import {
  AircraftRealm,
  AirlineRealm,
  AirportRealm,
} from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { Spacing } from '@theme/type';
import { translate } from '@vna-base/translations/translate';
import { convertMin2Hour, getFlightNumber, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { useStyles } from './style';

export const paddingLeftContentModal: Spacing = 12;

export const ItemFlightJourney = ({ item }: { item: Flight }) => {
  const realm = useRealm();
  const styles = useStyles();

  const [t] = useTranslation();

  const lng = useSelector(selectLanguage);

  const durationChangeFormat =
    item.Duration !== 0 &&
    item.Duration !== undefined &&
    convertMin2Hour(item.Duration);

  const componentStartPointRef = useRef<View>(null);
  const componentEndPointRef = useRef<View>(null);

  const [height, setHeight] = useState<number>(0);

  const handleLayout = () => {
    if (componentStartPointRef.current && componentEndPointRef.current) {
      componentStartPointRef.current.measureInWindow((x1, y1) => {
        componentEndPointRef.current!.measureInWindow((x2, y2) => {
          const distanceX = Math.abs(x2 - x1);
          const distanceY = Math.abs(y2 - y1);
          const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
          setHeight(distance);
        });
      });
    }
  };

  return (
    <Block flex={1} colorTheme="neutral100" padding={12} borderRadius={8}>
      {item.Segments?.map((segment, idx) => {
        const airportSP = realm.objectForPrimaryKey<AirportRealm>(
          AirportRealm.schema.name,
          segment.StartPoint as string,
        );
        const airportEP = realm.objectForPrimaryKey<AirportRealm>(
          AirportRealm.schema.name,
          segment.EndPoint as string,
        );
        const airline = realm.objectForPrimaryKey<AirlineRealm>(
          AirlineRealm.schema.name,
          segment.Operator as string,
        );

        const aircraft = realm.objectForPrimaryKey<AircraftRealm>(
          AircraftRealm.schema.name,
          segment?.Equipment ?? '0',
        );

        return (
          <Block key={idx}>
            {idx !== 0 && (
              <Block
                width={'100%'}
                height={1}
                colorTheme="neutral200"
                marginVertical={12}
              />
            )}
            <Block>
              {/* //cmt: start point */}
              <Block
                ref={componentStartPointRef}
                onLayout={handleLayout}
                flexDirection="row"
                alignItems="center"
                columnGap={24}>
                {/* //cmt: time departure date */}
                <Block rowGap={4} alignItems="center">
                  <Text
                    text={dayjs(segment.DepartDate).format('HH:mm')}
                    fontStyle="Title16Semi"
                    colorTheme="neutral900"
                  />
                  <Text
                    text={dayjs(segment.DepartDate).format('DD/MM')}
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                </Block>
                {/* //cmt: aiport start point */}
                <Block rowGap={4}>
                  <Text
                    text={`${
                      lng === 'vi'
                        ? airportSP?.City.NameVi
                        : airportSP?.City.NameEn
                    } (${airportSP?.Code})`}
                    fontStyle="Title16Semi"
                    colorTheme="neutral900"
                  />
                  <Block flexDirection="row" alignItems="center">
                    <Text
                      fontStyle="Body12Reg"
                      text={
                        lng === 'vi' ? airportSP?.NameVi : airportSP?.NameEn
                      }
                      colorTheme="neutral800"
                    />
                    {segment.StartTerminal && (
                      <Block
                        height={4}
                        width={4}
                        borderRadius={4}
                        marginHorizontal={4}
                        colorTheme="neutral400"
                      />
                    )}
                    {segment.StartTerminal && (
                      <Text
                        fontStyle="Body12Reg"
                        text={`${t('flight:station')} ${segment.StartTerminal}`}
                        colorTheme="neutral800"
                      />
                    )}
                  </Block>
                </Block>
              </Block>
              {/* //cmt: middle content */}
              <Block
                marginTop={16}
                flexDirection="row"
                alignItems="center"
                columnGap={24}>
                {/* //cmt: logo airline */}
                <Block paddingHorizontal={4} width={40} alignItems="center">
                  <Block
                    width={36}
                    height={36}
                    borderRadius={8}
                    overflow="hidden">
                    <SvgUri
                      width={36}
                      height={36}
                      uri={LOGO_URL + segment.Operator + '.svg'}
                    />
                  </Block>
                </Block>
                {/* //cmt: right content */}
                <Block
                  flex={1}
                  // marginLeft={12}
                  borderRadius={4}
                  paddingVertical={8}
                  paddingHorizontal={12}
                  colorTheme="secondary50"
                  rowGap={8}>
                  {/* //cmt: airline + model number airline */}
                  <Block flexDirection="row" alignItems="center" columnGap={4}>
                    <Text
                      text={airline?.NameVi ?? airline?.NameEn}
                      fontStyle="Body12Reg"
                      colorTheme="neutral900"
                    />
                    <Block
                      height={4}
                      width={4}
                      borderRadius={4}
                      colorTheme="neutral400"
                    />
                    <Text
                      text={getFlightNumber(
                        segment.Airline,
                        segment.FlightNumber,
                      ).toUpperCase()}
                      fontStyle="Body12Bold"
                      colorTheme="primary600"
                    />
                  </Block>
                  {/* //cmt: time duration */}
                  <Block flexDirection="row" alignItems="center" columnGap={4}>
                    <Text
                      fontStyle="Body12Reg"
                      t18n="flight:time_flight"
                      colorTheme="neutral800"
                    />
                    <Text
                      fontStyle="Body12Med"
                      text={
                        Number(durationChangeFormat) !== 0
                          ? (durationChangeFormat as string)
                          : 'N/A'
                      }
                      colorTheme="neutral900"
                    />
                  </Block>
                  {/* //cmt: info air craft */}
                  {aircraft !== null && (
                    <Block flexDirection="row" alignItems="center">
                      <Text
                        t18n="flight:flight"
                        fontStyle="Body12Reg"
                        colorTheme="neutral800"
                      />
                      <Text
                        text={aircraft?.Manufacturer + '-' + aircraft?.Model}
                        fontStyle="Body12Med"
                        colorTheme="neutral900"
                      />
                    </Block>
                  )}
                  {/* //cmt: fare class */}

                  {
                    //@ts-ignore
                    item.FareClass && (
                      <Block flexDirection="row" alignItems="center">
                        <Text
                          t18n="flight:fare_class"
                          fontStyle="Body12Reg"
                          colorTheme="neutral800"
                        />
                        <Text
                          //@ts-ignore
                          text={item.FareClass}
                          colorTheme="primary600"
                          fontStyle="Body12Bold"
                        />
                        {
                          //@ts-ignore
                          item.FareBasis && (
                            <Text
                              //@ts-ignore
                              text={`_${item.FareBasis}`}
                              colorTheme="primary600"
                              fontStyle="Body12Bold"
                            />
                          )
                        }
                      </Block>
                    )
                  }
                  {/* //cmt: status segment */}
                  <Block flexDirection="row" alignItems="center" columnGap={4}>
                    <Icon
                      icon={
                        segment.Status === 'HK'
                          ? 'checkmark_circle_fill'
                          : 'alert_circle_fill'
                      }
                      colorTheme={
                        segment.Status === 'HK' ? 'success500' : 'error500'
                      }
                      size={16}
                    />
                    <Text
                      text={`${segment.Status} - ${
                        segment.Status === 'HK'
                          ? translate('booking:confirm')
                          : translate('booking:not_confirm')
                      }`}
                      fontStyle="Body12Reg"
                      colorTheme="neutral900"
                    />
                  </Block>
                </Block>
              </Block>
              {/* //cmt: end point */}
              <Block
                ref={componentEndPointRef}
                onLayout={handleLayout}
                flexDirection="row"
                alignItems="center"
                columnGap={24}
                marginTop={16}>
                {/* //cmt: time ArriveDate */}
                <Block rowGap={4} alignItems="center">
                  <Text
                    text={dayjs(segment.DepartDate)
                      .add(segment.Duration ?? 0, 'minute')
                      .format('HH:mm')}
                    fontStyle="Title16Semi"
                    colorTheme="neutral900"
                  />
                  <Text
                    text={dayjs(segment.ArriveDate).format('DD/MM')}
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                </Block>
                {/* //cmt: aiport end point */}
                <Block rowGap={4}>
                  <Text
                    text={`${
                      lng === 'vi'
                        ? airportEP?.City.NameVi
                        : airportEP?.City.NameEn
                    } (${airportEP?.Code})`}
                    fontStyle="Title16Semi"
                    colorTheme="neutral900"
                  />
                  <Block flexDirection="row" alignItems="center">
                    <Text
                      fontStyle="Body12Reg"
                      text={
                        lng === 'vi' ? airportEP?.NameVi : airportEP?.NameEn
                      }
                      colorTheme="neutral800"
                    />
                    {segment.EndTerminal && (
                      <Block
                        height={4}
                        width={4}
                        borderRadius={4}
                        marginHorizontal={4}
                        colorTheme="neutral400"
                      />
                    )}
                    {segment.EndTerminal && (
                      <Text
                        fontStyle="Body12Reg"
                        text={`${t('flight:station')} ${segment.EndTerminal}`}
                        colorTheme="neutral800"
                      />
                    )}
                  </Block>
                </Block>
              </Block>
            </Block>
            {/* //cmt: kẻ xanh ở giữa */}
            <Block
              style={[
                styles.verticalLine2Segment,
                {
                  top: idx !== 0 ? scale(38) : scale(14),
                  left: paddingLeftContentModal + scale(42),
                  height: height !== null ? height - 12 : scale(186),
                },
              ]}>
              <Block
                width={8}
                height={8}
                borderRadius={4}
                children={
                  <Block
                    width={4}
                    height={4}
                    style={styles.beginColorDotVerticalLine}
                  />
                }
                style={styles.beginDotVerticalLine}
              />
              <Block
                width={8}
                height={8}
                borderRadius={4}
                children={
                  <Block
                    width={4}
                    height={4}
                    style={styles.endColorDotVerticalLine}
                  />
                }
                style={styles.endDotVerticalLine}
              />
            </Block>
          </Block>
        );
      })}
    </Block>
  );
};
