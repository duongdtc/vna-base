import { LinearGradient, Text } from '@vna-base/components';
import { selectSearchForm } from '@vna-base/redux/selector';
import { bs } from '@theme';
import { translate } from '@vna-base/translations/translate';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

type Props = {
  type: 'RoundStage' | 'MultiStage';
};

export const SeparatorMultiFlight = memo(({ type }: Props) => {
  const { Flights } = useSelector(selectSearchForm);

  const startPoint = Flights[0].airport.takeOff?.Code;
  const endPoint =
    type === 'MultiStage'
      ? Flights[Flights.length - 1].airport.takeOff?.Code
      : Flights[0].airport.landing?.Code;

  return (
    <View
      style={[
        bs.marginTop_8,
        bs.marginBottom_12,
        bs.paddingHorizontal_12,
        bs.paddingVertical_16,
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      ]}>
      <LinearGradient style={StyleSheet.absoluteFillObject} type="gra3" />
      <Text fontStyle="Body16Reg" colorTheme="white">
        {translate('flight:combined_flight')}{' '}
        <Text
          fontStyle="Body16Bold"
          colorTheme="white"
          text={translate(
            type === 'RoundStage' ? 'flight:round_stage' : 'flight:multi_stage',
          ).toLocaleLowerCase()}
        />
      </Text>
      <Text
        fontStyle="Body14Semi"
        colorTheme="white"
        text={`${startPoint} - ${endPoint}`}
      />
    </View>
  );
}, isEqual);
