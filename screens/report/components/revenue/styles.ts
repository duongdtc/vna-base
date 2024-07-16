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
        headerContainer: {
          padding: scale(12),
          paddingRight: scale(8),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },

        yAxisTextStyle: {
          transform: [{ rotateZ: '-45deg' }],
          color: colors.neutral700,
          ...FontStyle.Capture11Reg,
        },
        xAxisTextStyle: {
          color: colors.neutral700,
          ...FontStyle.Capture11Reg,
        },
      }),
    [colors.neutral700],
  );
};
