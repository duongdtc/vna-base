import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: colors.neutral50 },
        linearContainer: {
          zIndex: 10,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: top + 56,
          backgroundColor: colors.neutral100,
        },
        bgLinear: { flex: 1 },
        contentContainer: {
          padding: scale(16),
          paddingBottom: scale(36),
          rowGap: scale(16),
        },
        top: { marginBottom: scale(7) },
      }),
    [colors.neutral100, colors.neutral50, top],
  );
};
