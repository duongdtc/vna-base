import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontStyle } from '@theme/typography';

export const useStyles = () => {
  const { colors } = useTheme();
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
          paddingBottom: bottom + scale(12),
        },
        inputPrice: {
          color: colors.price,
          ...FontStyle.Title16Semi,
        },
      }),
    [bottom, colors.neutral50, colors.price],
  );
};
