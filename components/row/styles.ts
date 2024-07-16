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
          paddingVertical: scale(20),
          paddingLeft: scale(16),

          flexDirection: 'row',
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
        input: {
          color: colors.neutral900,
          paddingVertical: 0,
          // lineHeight: 19,
          // backgroundColor: 'red',
        },
        plhInput: { color: colors.neutral700 },
        inputErr: { color: colors.error400 },
      }),
    [colors],
  );
};
