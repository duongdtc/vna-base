import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        input: {
          backgroundColor: colors.neutral100,
          // margin: scale(16),
        },
        inputBase: {
          color: colors.neutral900,
        },
        itemContainer: {
          padding: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(8),
        },
        contentContainer: { marginTop: scale(16), paddingBottom: bottom + 32 },
      }),
    [bottom, colors.neutral100, colors.neutral900],
  );
};
