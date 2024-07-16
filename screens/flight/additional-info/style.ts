import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        footerContainer: {
          paddingBottom: bottom + 12,
        },
        row: {
          backgroundColor: colors.neutral100,
          borderWidth: HairlineWidth * 3,
          borderColor: colors.neutral300,
          flexDirection: 'row',
          alignItems: 'center',
          padding: scale(12),
          borderRadius: 8,
          justifyContent: 'space-between',
        },
      }),
    [bottom, colors],
  );
};
