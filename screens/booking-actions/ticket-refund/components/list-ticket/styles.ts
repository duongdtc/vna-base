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
          padding: scale(12),
          paddingLeft: scale(16),
          backgroundColor: colors.neutral100,
          flexDirection: 'row',
          columnGap: scale(12),
          alignItems: 'center',
        },
        disabledItem: {
          opacity: 0.6,
        },
      }),
    [colors.neutral100],
  );
};
