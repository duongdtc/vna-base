import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: colors.neutral50 },
        contentContainer: {
          padding: scale(12),
          rowGap: scale(12),
        },
      }),
    [colors.neutral50],
  );
};
