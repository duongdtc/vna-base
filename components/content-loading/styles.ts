import { useTheme } from '@theme';
import { scale } from '@utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral100,
          borderRadius: scale(8),
          padding: scale(12),
          paddingBottom: scale(16),
          marginHorizontal: 8,
          marginBottom: 8,
        },
      }),
    [colors],
  );
};
