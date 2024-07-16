import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        contentContainer: {
          rowGap: 8,
          paddingTop: 8,
          backgroundColor: colors.neutral50,
          paddingBottom: scale(36),
        },
      }),
    [colors.neutral50],
  );
};
