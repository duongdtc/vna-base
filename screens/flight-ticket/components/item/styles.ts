import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderRadius: scale(12),
          paddingVertical: scale(12),
          backgroundColor: colors.neutral100,
        },
      }),
    [colors],
  );
};
