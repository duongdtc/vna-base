import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral100,
        },
        contentContainer: {
          padding: 12,
          paddingBottom: bottom + 12,
        },
      }),
    [colors, bottom],
  );
};
