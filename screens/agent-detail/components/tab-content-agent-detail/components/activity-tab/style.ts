import { useTheme } from '@theme';
import { ModalWidth } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { FontStyle } from '@theme/typography';

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
        input: {
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          borderColor: colors.neutral200,
          maxWidth: ModalWidth,
          height: 131,
          color: colors.neutral900,
          ...FontStyle.Body16Reg,
        },
      }),
    [colors],
  );
};
