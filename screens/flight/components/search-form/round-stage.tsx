import { Form } from '@vna-base/screens/flight/components/form';
import React from 'react';
import { View, ViewProps } from 'react-native';

export const RoundStage = (
  props: Pick<ViewProps, 'onLayout'> & { changeTab?: (i: number) => void },
) => (
  <View {...props}>
    <Form index={0} roundTrip />
  </View>
);
