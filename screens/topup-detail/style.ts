import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { FontStyle } from '@theme/typography';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
        },
        contentContainer: {
          padding: scale(12),
          rowGap: scale(12),
        },

        infoItemContainer: {
          flexDirection: 'row',
          paddingVertical: scale(20),
          paddingHorizontal: scale(12),
          alignItems: 'center',
          columnGap: scale(8),
          justifyContent: 'space-between',
          backgroundColor: colors.neutral100,
        },
        infoItemTitle: {
          ...FontStyle.Body14Reg,
          color: colors.neutral800,
        },
        infoItemValue: {
          ...FontStyle.Body14Semi,
          color: colors.neutral900,
        },
      }),
    [colors],
  );
};
