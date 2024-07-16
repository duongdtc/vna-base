import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();

  const { shadows, colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        contentContainerScrollView: {
          paddingTop: scale(12),
          rowGap: scale(12),
          backgroundColor: colors.neutral100,
        },
        contentContainerFlatList: {
          paddingHorizontal: scale(16),
          paddingBottom: scale(16),
        },
        img: { width: scale(178), height: scale(56) },
        footer: {
          padding: scale(12),
          paddingBottom: scale(12) + bottom,
          backgroundColor: colors.neutral100,
          rowGap: scale(10),
          ...shadows.main,
        },
      }),
    [bottom, colors.neutral100, shadows.main],
  );
};
