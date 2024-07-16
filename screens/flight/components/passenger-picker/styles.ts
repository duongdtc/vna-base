import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        btn: {
          padding: scale(4),
          borderWidth: HairlineWidth * 2,
          borderRadius: scale(20),
          borderColor: colors.neutral800,
        },
        txtValue: {
          width: scale(24),
          textAlign: 'center',
        },
      }),
    [colors],
  );
};
