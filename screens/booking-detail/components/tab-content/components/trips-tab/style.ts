import { useTheme } from '@theme';
import { Opacity } from '@theme/color';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          padding: 12,
        },
        verticalLine2Segment: {
          position: 'absolute',
          width: 1,
          backgroundColor: colors.primary400,
        },
        beginDotVerticalLine: {
          borderWidth: 2,
          borderColor: colors.primary500 + Opacity[60],
          position: 'absolute',
          left: -3.2,
          top: -8,
        },
        beginColorDotVerticalLine: {
          backgroundColor: colors.neutral100,
          borderRadius: 2,
        },
        endDotVerticalLine: {
          borderWidth: 2,
          borderColor: colors.primary500 + Opacity[60],
          position: 'absolute',
          left: -3.2,
          bottom: -8,
        },
        endColorDotVerticalLine: {
          backgroundColor: colors.primary500,
          borderRadius: 2,
        },
      }),
    [colors],
  );
};
