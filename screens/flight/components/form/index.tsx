import { FormFlightProp } from '@vna-base/screens/flight/type';
import { bs } from '@theme';
import React from 'react';
import { View } from 'react-native';
import { AirportPicker } from '../airport-picker';
import { DatePicker } from '../date-picker';

export const Form = ({
  style,
  index,
  roundTrip,
  selectBackDayDone,
}: FormFlightProp) => (
  <View style={[style, bs.rowGap_16]}>
    <AirportPicker index={index} />
    <DatePicker
      index={index}
      roundTrip={roundTrip}
      selectBackDayDone={selectBackDayDone}
    />
  </View>
);
