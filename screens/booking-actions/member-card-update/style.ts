import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';

export const useStyles = () => {
  // state
  const { colors } = useTheme();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        contentContainer: {
          backgroundColor: colors.neutral50,
          padding: 12,
        },
      }),
    [colors],
  );
};
