import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { scale } from '@vna-base/utils';

export const useStyles = () => {
  // state

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          borderRadius: scale(8),
          overflow: 'hidden',
        },
      }),
    [],
  );
};
