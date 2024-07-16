import { useTheme } from '@theme';
import { FontDefault } from '@theme/typography';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

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
        topLabelTxt: {
          color: colors.neutral700,
          fontFamily: FontDefault.Semi,
          textAlign: 'center',
          fontSize: 9,
          lineHeight: 10,
        },
        footerContainer: {
          marginTop: -28,
          flexDirection: 'row',
          paddingHorizontal: 8,
          columnGap: 8,
          overflow: 'hidden',
        },
      }),
    [colors.neutral700],
  );
};
