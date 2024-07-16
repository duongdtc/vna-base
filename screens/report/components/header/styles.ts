import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        logo: {
          width: scale(132),
          height: scale(16),
        },
      }),
    [],
  );
};
