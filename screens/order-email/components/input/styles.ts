import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { FontStyle } from '@theme/typography';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: scale(20),
          paddingLeft: scale(16),
          paddingRight: scale(12),
          backgroundColor: colors.neutral100,
          borderRadius: scale(8),
          borderWidth: 2,
          borderColor: colors.neutral100,
        },
        containerError: {
          backgroundColor: colors.error50,
          borderColor: colors.error500,
        },
        input: {
          color: colors.neutral700,
          ...FontStyle.Body14Reg,
        },
      }),
    [colors.error50, colors.error500, colors.neutral100, colors.neutral700],
  );
};
