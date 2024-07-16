import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from '@vna-base/utils';

export const useStyles = () => {
  // state
  const { bottom } = useSafeAreaInsets();
  const { colors, shadows } = useTheme();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        containerBottom: {
          backgroundColor: colors.neutral100,
          paddingTop: scale(12),
          paddingHorizontal: scale(12),
          paddingBottom: bottom + scale(8),
          ...shadows.main,
        },
        contentContainer: {
          backgroundColor: colors.neutral50,
          paddingBottom: bottom + 12,
          rowGap: 12,
        },
      }),
    [colors.neutral50, colors.neutral100, bottom, shadows.main],
  );
};
