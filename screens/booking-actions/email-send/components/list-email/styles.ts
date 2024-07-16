import { useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        inputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: scale(20),
          paddingLeft: scale(16),
          flex: 1,
          paddingRight: scale(12),
        },
        input: { flex: 1, color: colors.neutral900, ...FontStyle.Body16Reg },
        inputError: { color: colors.error500 },
        rightContainer: {
          paddingHorizontal: scale(12),
          paddingVertical: scale(20),
        },
        addEmailContainer: {
          flexDirection: 'row',
          columnGap: 4,
          alignItems: 'center',
          paddingVertical: scale(20),
          justifyContent: 'center',
        },
      }),
    [],
  );
};
