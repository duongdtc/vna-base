import { useTheme } from '@theme';
import { scale } from '@utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: { flexDirection: 'row', alignItems: 'center' },
        containerEditHTML: {
          paddingVertical: scale(20),
          paddingLeft: scale(16),
          paddingRight: scale(12),
          rowGap: 4,
        },
        leftContainer: {
          flexDirection: 'row',
          paddingVertical: scale(20),
          alignItems: 'center',
          columnGap: 4,
        },
        rightContainer: {
          height: '100%',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: scale(12),
        },
        input: { color: colors.neutral900 },
        plhInput: { color: colors.neutral700 },
        inputErr: { color: colors.error400 },
      }),
    [colors],
  );
};
