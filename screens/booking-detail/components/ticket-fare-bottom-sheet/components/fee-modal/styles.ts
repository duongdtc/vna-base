import { useTheme } from '@theme';
import { ModalWidth, scale } from '@vna-base/utils';
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
        row: {
          maxWidth: ModalWidth,
          backgroundColor: colors.neutral100,
          borderWidth: 1,
          borderColor: colors.neutral300,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 11,
          borderRadius: 8,
          justifyContent: 'space-between',
        },
        statusItemContainer: {
          padding: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(8),
        },
      }),
    [colors, bottom],
  );
};
