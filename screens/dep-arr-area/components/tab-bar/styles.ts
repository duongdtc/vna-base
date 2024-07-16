import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        departureTabBarBtn: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: scale(12),
        },
        departureTabBarAnimatedFooter: {
          backgroundColor: colors.primary500,
          bottom: 0,
          position: 'absolute',
          height: scale(3),
        },
      }),
    [colors.primary500],
  );
};
