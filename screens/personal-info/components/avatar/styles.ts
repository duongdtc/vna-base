import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors, shadows } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        avatarContainer: {
          backgroundColor: colors.neutral100,
          borderRadius: 60,
          padding: 4,
          width: scale(88),
          height: scale(88),
          ...shadows.small,
        },
        avatar: {
          width: scale(80),
          height: scale(80),
          borderRadius: scale(60),
          overflow: 'hidden',
        },
      }),
    [colors.neutral100, shadows.small],
  );
};
