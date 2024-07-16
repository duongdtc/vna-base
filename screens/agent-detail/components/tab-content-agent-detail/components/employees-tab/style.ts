import { useTheme } from '@theme';
import { ModalWidth } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          maxWidth: ModalWidth,
          backgroundColor: colors.neutral100,
          borderWidth: 1,
          borderColor: colors.neutral200,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderRadius: 8,
          justifyContent: 'space-between',
        },
      }),
    [colors],
  );
};
