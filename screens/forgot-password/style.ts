import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';

export const useStyles = () => {
  // state
  const { colors } = useTheme();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
        },
        eyeIcContainer: {
          flex: 1,
          justifyContent: 'center',
        },
        inputBaseStyle: {
          color: colors.neutral900,
        },
        btnRememberAcc: {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(4),
        },
        welcomeTitle: { marginTop: scale(24), marginBottom: scale(16) },
        btnContainer: {
          borderBottomWidth: scale(2),
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: scale(8),
          width: scale(104),
        },
      }),
    [colors],
  );
};
