import { WindowWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        templateContainer: {
          rowGap: scale(12),
          alignItems: 'center',
        },
        templateImg: {
          width: (WindowWidth - 12 * 2 - 16 * 2 - 12 - 2 * 4) / 2,
          height:
            ((210 / 148) * (WindowWidth - 12 * 2 - 16 * 2 - 12 - 2 * 4)) / 2,
        },
      }),
    [],
  );
};
