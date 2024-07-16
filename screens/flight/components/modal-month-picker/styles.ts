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
          flex: 1,
          backgroundColor: colors.neutral100,
        },
        title: {
          paddingVertical: scale(12),
          backgroundColor: colors.neutral50,
          alignItems: 'center',
        },

        item: {
          padding: scale(16),
        },
        selected: {
          backgroundColor: colors.primary50,
        },
        contentContainer: {
          backgroundColor: colors.neutral100,
        },
      }),
    [colors],
  );
};
