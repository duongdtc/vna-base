import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        footer: {
          padding: scale(12),
          paddingBottom: bottom + scale(12),
          backgroundColor: colors.neutral100,
          ...shadows['.3'],
        },
      }),
    [bottom, colors.neutral100, colors.neutral50, shadows],
  );
};
