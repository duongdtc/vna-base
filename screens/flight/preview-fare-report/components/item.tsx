/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { selectCustomFeeTotal } from '@vna-base/redux/selector';
import { AirOption, Flight } from '@services/axios/axios-ibe';
import { getFlightNumber } from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';

export const Item = (data: AirOption & { index: number }) => {
  const { TotalFare } = useSelector(selectCustomFeeTotal);

  const renderOneStageInItemMultiFlight = (fl: Flight) => {
    return (
      <Block
        flexDirection="row"
        alignItems="center"
        columnGap={4}
        key={`${fl.FlightId}${fl.FlightNumber}`}>
        <Block width={20} height={20} borderRadius={4} overflow="hidden">
          <SvgUri width={20} height={20} uri={LOGO_URL + fl.Airline + '.svg'} />
        </Block>
        <Block
          flexDirection="row"
          justifyContent="space-between"
          width={76}
          alignItems="center">
          <Text
            colorTheme="neutral900"
            fontStyle="Capture11Bold"
            text={dayjs(fl.StartDate).format('HH:mm')}
          />
          <Text colorTheme="neutral900" fontStyle="Capture11Bold" text="-" />
          <Text
            colorTheme="neutral900"
            fontStyle="Capture11Bold"
            text={dayjs(fl.EndDate).format('HH:mm')}
          />
        </Block>
        <Text
          colorTheme="neutral900"
          fontStyle="Capture11Reg"
          text={`${fl.StartPoint} - ${fl.EndPoint}`}
        />
        <Text
          colorTheme="neutral900"
          fontStyle="Capture11Reg"
          text={dayjs(fl.StartDate).format('DD/MM')}
        />
        <Block flex={1}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            fontStyle="Capture11Bold"
            colorTheme="neutral900"
            text={getFlightNumber(fl.Airline, fl.FlightNumber)}
          />
        </Block>
      </Block>
    );
  };

  return (
    <Block
      key={data.index.toString()}
      flexDirection="row"
      padding={8}
      marginHorizontal={8}
      alignItems="center"
      justifyContent="space-between">
      <Block flex={1} rowGap={8}>
        {data.ListFlightOption![0].ListFlight!.map(fl =>
          renderOneStageInItemMultiFlight(fl),
        )}
      </Block>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        columnGap={4}>
        <Block width={80} alignItems="flex-end">
          <Text
            fontStyle="Capture11Bold"
            colorTheme="price"
            text={(
              (data.ListFareOption![0].TotalFare ?? 0) + TotalFare
            ).currencyFormat()}
          />
        </Block>
      </Block>
    </Block>
  );
};
