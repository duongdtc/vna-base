import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        containerMoreOption: {
          backgroundColor: colors.neutral100,
        },
        contentContainerMoreOption: {
          paddingTop: scale(12),
          paddingBottom: bottom + scale(48),
        },
        avatarImg: {
          width: scale(32),
          height: scale(32),
          borderRadius: scale(16),
        },
      }),
    [colors, bottom],
  );
};
