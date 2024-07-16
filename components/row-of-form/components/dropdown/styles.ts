import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        selectedStatusItemContainer: {
          backgroundColor: colors.primary50,
        },
        statusItemContainer: {
          padding: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(8),
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
        input: { color: colors.neutral700 },
      }),
    [colors.neutral700, colors.primary50],
  );
};
