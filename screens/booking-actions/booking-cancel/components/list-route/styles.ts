import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        itemContainer: {
          flexDirection: 'row',
          paddingVertical: 8,
          paddingLeft: scale(16),
          paddingRight: scale(12),
          backgroundColor: colors.neutral100,
          columnGap: scale(8),
          alignItems: 'center',
        },
        disabledItem: {
          opacity: 0.6,
        },
      }),
    [colors.neutral100],
  );
};
