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
        container: {
          backgroundColor: colors.neutral50,
        },
        contentContainer: {
          padding: scale(12),
          rowGap: scale(12),
        },
        footerContainer: {
          padding: scale(12),
          paddingBottom: bottom + 12,
          columnGap: scale(12),
          flexDirection: 'row',
          backgroundColor: colors.neutral100,
          ...shadows.main,
        },
        contentSMSContainer: {
          padding: scale(12),
          backgroundColor: colors.neutral100,
          borderRadius: 8,
          rowGap: 4,
        },
        contentSMS: {
          color: colors.neutral700,
          ...FontStyle.Body14Reg,
        },
      }),
    [
      bottom,
      colors.neutral100,
      colors.neutral50,
      colors.neutral700,
      shadows.main,
    ],
  );
};
