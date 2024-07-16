import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        footerContainer: {
          paddingBottom: bottom + 12,
          ...shadows.main,
        },
        fareContainer: { rowGap: 4, flex: 1 },
      }),
    [bottom, shadows.main],
  );
};
