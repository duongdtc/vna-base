import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        input: { flex: 1, height: '100%', marginLeft: scale(0) },
        selectDiscount: {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(2),
        },
        header: {
          flexDirection: 'row',
          columnGap: scale(12),
          paddingVertical: scale(8),
          paddingHorizontal: scale(12),
          alignItems: 'center',
        },
        selectedStatusItemContainer: {
          backgroundColor: colors.primary50,
        },
        statusItemContainer: {
          padding: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(8),
        },
      }),
    [colors.primary50],
  );
};
