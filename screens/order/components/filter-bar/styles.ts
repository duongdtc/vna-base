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
        dateContainer: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          height: '100%',
        },
        statusContentContainer: {
          paddingHorizontal: scale(12),
          paddingTop: 4,
          paddingBottom: 2,
        },
        statusItemContainer: {
          paddingHorizontal: scale(8),
          paddingVertical: 4,
          flexDirection: 'row',
          columnGap: 4,
          borderRadius: 4,
          borderWidth: 2,
          alignItems: 'center',
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
