import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@theme';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral100,
        },
      }),
    [colors.neutral100],
  );
};
