import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        contentContainerStyle: {
          padding: scale(12),
          rowGap: scale(12),
        },
        pressableNav: {
          flexDirection: 'row',
          backgroundColor: colors.neutral100,
          padding: scale(12),
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      }),
    [colors],
  );
};
