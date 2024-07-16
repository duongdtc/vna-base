import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        stepContainer: {
          padding: scale(8),
          width: scale(34),
          borderRadius: scale(8),
          alignItems: 'center',
        },
        logoBank: {
          width: scale(28),
          height: scale(28),
        },
        qr: {
          width: scale(190),
          height: scale(210),
        },
      }),
    [bottom, colors.neutral100, colors.neutral50, shadows.main],
  );
};
