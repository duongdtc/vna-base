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
          columnGap: scale(12),
          flexDirection: 'row',
          backgroundColor: colors.neutral100,
          ...shadows.main,
        },
      }),
    [bottom, colors.neutral100, shadows.main],
  );
};
