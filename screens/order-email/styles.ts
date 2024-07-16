import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';

export const useStyles = () => {
  const { colors } = useTheme();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        contentContainer: {
          padding: scale(12),
          rowGap: scale(12),
        },
      }),
    [colors],
  );
};
