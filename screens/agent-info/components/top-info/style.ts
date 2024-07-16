import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';

export const useStyles = () => {
  // state
  const { colors, shadows } = useTheme();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        avatarContainer: {
          alignSelf: 'center',
          width: scale(84),
          height: scale(84),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.neutral100,
          borderRadius: 60,
          padding: 4,
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
