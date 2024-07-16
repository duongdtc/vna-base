import { Text } from '@vna-base/components';
import { FilterForm } from '@vna-base/screens/policy/type';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStyles } from './styles';

export const DotStarFilter = () => {
  const styles = useStyles();
  const { control } = useFormContext<FilterForm>();

  const form = useWatch({
    control,
  });

  if (isEmpty(form.Filter)) {
    return null;
  }

  return <Text text="*" style={styles.dotStar} />;
};
