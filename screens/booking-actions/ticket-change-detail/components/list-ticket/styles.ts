import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.neutral100,
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: scale(12),
          borderWidth: HairlineWidth * 3,
        },
      }),
    [colors.neutral100],
  );
};
