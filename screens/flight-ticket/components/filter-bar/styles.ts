import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontStyle } from '@theme/typography';

export const useStyles = () => {
  const { colors, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        optionFilterMenuContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: scale(16),
        },
        bottomSheetContentContainer: {},
        bottomSheetContainer: {
          backgroundColor: colors.neutral100,
        },
        dotStar: {
          color: colors.error500,
          position: 'absolute',
          ...FontStyle.Display24Bold,
          top: 2,
          right: 4,
        },
        confirmContainer: {
          paddingTop: scale(12),
          paddingHorizontal: scale(16),
          paddingBottom: bottom + scale(12),
          backgroundColor: colors.neutral100,
          ...shadows.main,
        },
      }),
    [bottom, colors.error500, colors.neutral100, shadows.main],
  );
};
