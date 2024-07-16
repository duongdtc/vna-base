import { useTheme } from '@theme';
import { WindowWidth } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        footerContainer: {
          paddingBottom: bottom + 12,
        },
        row: {
          backgroundColor: colors.neutral100,
          borderWidth: 1,
          borderColor: colors.neutral300,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          borderRadius: 8,
          justifyContent: 'space-between',
        },
        textInput: {
          width: WindowWidth - 32,
          height: '100%',
          padding: 12,
          overflow: 'hidden',
          color: colors.neutral900,
          textAlignVertical: 'top',
        },
      }),
    [bottom, colors],
  );
};
