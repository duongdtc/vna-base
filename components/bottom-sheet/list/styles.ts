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
          borderTopLeftRadius: scale(10),
          borderTopRightRadius: scale(10),
        },
        input: {
          backgroundColor: colors.neutral100,
          margin: scale(16),
        },
        inputBase: {
          color: colors.primary500,
        },
        list: { flex: 1 },
        contentContainerStyle: {
          // marginHorizontal: scale(16),
        },
        body: { flex: 1, backgroundColor: colors.neutral100 },
        leftIconTextInput: {
          color: colors.neutral400,
        },
      }),
    [colors],
  );
};
