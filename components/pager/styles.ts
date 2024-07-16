import { WindowWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: WindowWidth,
          flex: 1,
          rowGap: scale(16),
        },
        btnHeader: {
          flex: 1,
          paddingVertical: scale(12),
          alignItems: 'center',
          paddingHorizontal: 8,
        },
      }),
    [],
  );
};
