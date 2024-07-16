import { useTheme } from '@theme';
import { WindowWidth } from '@vna-base/utils';
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
        datePicker: {
          width: WindowWidth,
          height: 252,
          backgroundColor: colors.neutral100,
        },
        datePickerTxt: { color: colors.neutral900 },
        fadeToColor: { color: colors.neutral100 },
        dividerColor: {
          color: colors.neutral900,
        },
      }),
    [colors],
  );
};
