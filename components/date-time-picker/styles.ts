import { useTheme } from '@theme';
import { scale } from '@utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral100,
        },
        datePicker: { height: scale(400) },
      }),
    [colors],
  );
};
