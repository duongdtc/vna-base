import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors, shadows } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        containerBottom: {
          backgroundColor: colors.neutral100,
          paddingTop: scale(8),
          paddingHorizontal: scale(12),
          paddingBottom: bottom + scale(8),
          ...shadows.main,
        },
      }),
    [bottom, colors.neutral100, colors.neutral50, shadows.main],
  );
};
