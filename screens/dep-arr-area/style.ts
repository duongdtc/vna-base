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
          backgroundColor: colors.neutral100,
        },
        containerBottom: {
          backgroundColor: colors.neutral100,
          paddingTop: scale(12),
          paddingHorizontal: scale(12),
          paddingBottom: bottom + scale(8),
          ...shadows.main,
        },
        welcomeTitle: { marginTop: scale(24), marginBottom: scale(16) },
        inputBaseStyle: {
          color: colors.neutral900,
        },
      }),
    [bottom, colors.neutral100, colors.neutral900, shadows.main],
  );
};
