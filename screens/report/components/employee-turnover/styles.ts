import { useTheme } from '@theme';
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
        filterBar: {
          backgroundColor: colors.success500,
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
        },
        contentContainer: {
          padding: scale(16),
        },
      }),
    [colors.success500],
  );
};
