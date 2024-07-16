import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontStyle } from '@theme/typography';

export const useStyles = () => {
  const { colors, shadows } = useTheme();

  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: colors.neutral100 },
        contentContainer: {
          padding: scale(12),
          rowGap: scale(12),
        },
        body: {
          backgroundColor: colors.neutral50,
        },
        footer: {
          paddingHorizontal: scale(16),
          paddingTop: scale(12),
          backgroundColor: colors.neutral100,
          paddingBottom: scale(12) + bottom,
          ...shadows.main,
        },
        bankContainer: {
          paddingVertical: scale(20),
          paddingHorizontal: scale(16),
        },
        amountInput: {
          color: colors.price,
          ...FontStyle.Body14Semi,
        },
      }),
    [bottom, colors.neutral100, colors.neutral50, colors.price, shadows.main],
  );
};
