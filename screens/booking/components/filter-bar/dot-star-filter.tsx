import { Text } from '@vna-base/components';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStyles } from './styles';
import { FilterForm } from '@vna-base/screens/booking/type';

export const DotStarFilter = () => {
  const styles = useStyles();
  const { control } = useFormContext<FilterForm>();

  const form = useWatch({
    control,
  });

  if (isEmpty(form.Filter)) {
    return null;
  }

  const bookingStatusIdx = form.Filter?.findIndex(
    it => it.Name === 'BookingStatus',
  );

  if (bookingStatusIdx !== -1 && form.Filter?.length === 1) {
    return null;
  }

  return <Text text="*" style={styles.dotStar} />;
};
