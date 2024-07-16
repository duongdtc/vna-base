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
          backgroundColor: colors.neutral100,
        },
        containerBottom: {
          backgroundColor: colors.neutral100,
          borderTopWidth: scale(2),
          borderColor: colors.neutral200,
          paddingTop: scale(12),
          paddingHorizontal: scale(12),
          paddingBottom: bottom + scale(8),
          ...shadows.main,
        },
        contentContainer: {
          padding: scale(12),
          rowGap: scale(12),
        },
        copyIcon: {
          position: 'absolute',
          bottom: 6,
          right: -20,
        },
      }),
    [bottom, colors, shadows.main],
  );
};
