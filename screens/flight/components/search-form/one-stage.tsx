import { Form } from '@vna-base/screens/flight/components/form';
import React, { useCallback } from 'react';
import { View, ViewProps } from 'react-native';

export const OneStage = (
  props: Pick<ViewProps, 'onLayout'> & { changeTab?: (i: number) => void },
) => {
  const { changeTab, ...subProps } = props;

  const selectBackDayDone = useCallback(() => {
    changeTab?.(1);
  }, []);

  return (
    <View {...subProps}>
      <Form index={0} selectBackDayDone={selectBackDayDone} />
    </View>
  );
};
