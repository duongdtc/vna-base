import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: colors.neutral100 },
        textHighLight: {
          color: colors.primary600,
        },
        textNormal: {
          color: colors.neutral900,
        },
        textSubtitle: {
          color: colors.warning600,
        },
        wrapTextOption: {
          flexDirection: 'row',
          paddingVertical: scale(16),
          alignItems: 'center',
          gap: scale(8),
        },
        pH16: {
          paddingHorizontal: scale(16),
        },
        iconCheck: {
          position: 'absolute',
          alignSelf: 'center',
          right: scale(16),
        },
        jCC: {
          justifyContent: 'center',
        },
      }),
    [colors],
  );
};
