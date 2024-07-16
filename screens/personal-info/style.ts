import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from '@vna-base/utils';

export const useStyles = () => {
  const { colors, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral100,
        },
        contentContainer: {
          backgroundColor: colors.neutral50,
          paddingBottom: bottom + 12,
        },
        containerBottom: {
          backgroundColor: colors.neutral100,
          paddingTop: scale(12),
          paddingHorizontal: scale(12),
          paddingBottom: bottom + scale(8),
          ...shadows.main,
        },
      }),
    [bottom, colors, shadows],
  );
};
