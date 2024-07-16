import { Block, LinearGradient, Text } from '@vna-base/components';
import { selectSearchForm } from '@redux-selector';
import { translate } from '@vna-base/translations/translate';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { StyleSheet } from 'react-native';
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
    <Block
      marginTop={8}
      marginBottom={12}
      paddingHorizontal={12}
      paddingVertical={16}
      width={'100%'}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center">
      <LinearGradient style={StyleSheet.absoluteFillObject} type="003" />
      <Text fontStyle="Body16Reg" colorTheme="classicWhite">
        {translate('flight:combined_flight')}{' '}
        <Text
          fontStyle="Title16Bold"
          colorTheme="classicWhite"
          text={translate(
            type === 'RoundStage' ? 'flight:round_stage' : 'flight:multi_stage',
          ).toLocaleLowerCase()}
        />
      </Text>
      <Text
        fontStyle="Body14Semi"
        colorTheme="classicWhite"
        text={`${startPoint} - ${endPoint}`}
      />
    </Block>
  );
}, isEqual);
