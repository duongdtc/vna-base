import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          paddingHorizontal: scale(16),
          paddingBottom: bottom,
          paddingTop: scale(12),
        },
        itemContainer: {
          flex: 1,
          paddingHorizontal: scale(12),
          paddingVertical: scale(8),
          rowGap: scale(4),
          borderRadius: scale(4),
        },
        itemPressable: {
          borderWidth: HairlineWidth * 3,
          borderColor: colors.neutral200,
          ...shadows.medium,
          backgroundColor: colors.neutral100,
        },
        itemSection: {
          flexDirection: 'row',
          columnGap: scale(16),
          marginBottom: scale(16),
        },
      }),
    [bottom, colors.neutral100, colors.neutral200, shadows.medium],
  );
};
