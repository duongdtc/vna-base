import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  // state
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        animatedDeleteBar: {
          position: 'absolute',
          top: top,
          left: 0,
          right: 0,
          zIndex: 9,
        },
      }),
    [colors.neutral50, top],
  );
};
