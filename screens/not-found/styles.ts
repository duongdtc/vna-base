import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors, shadows } = useTheme();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        footerContainer: {
          padding: scale(12),
          paddingBottom: bottom + 12,
          columnGap: scale(12),
          flexDirection: 'row',
          backgroundColor: colors.neutral100,
          ...shadows.main,
        },
        img: {
          width: scale(268),
          height: scale(138),
        },
      }),
    [bottom, colors.neutral100, colors.neutral50, shadows.main],
  );
};
