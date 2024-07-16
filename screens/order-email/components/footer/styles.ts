import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors, shadows } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: scale(12),
          paddingBottom: bottom + 12,
          rowGap: scale(10),
          backgroundColor: colors.neutral100,
          ...shadows.main,
        },
        eticketTabContentContainer: {
          paddingBottom: bottom,
          paddingTop: 8,
          backgroundColor: colors.neutral50,
        },
        eticketHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: scale(8),
          paddingLeft: scale(16),
          paddingRight: scale(12),
          backgroundColor: colors.neutral100,
        },
      }),
    [bottom, colors.neutral100, colors.neutral50, shadows.main],
  );
};
