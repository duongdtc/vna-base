import { useTheme } from '@theme';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        tabBar: { backgroundColor: colors.neutral100 },
        tab: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      }),
    [colors],
  );
};
