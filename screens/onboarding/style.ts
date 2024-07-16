import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@theme';
import { ColorLight } from '@theme/color';
import { HairlineWidth, scale } from '@vna-base/utils';

export const useOnboardStyle = () => {
  // state
  const { colors } = useTheme();

  // result
  return useMemo(
    () =>
      StyleSheet.create({
        paginationStyle: {
          borderTopWidth: HairlineWidth,
          borderColor: 'gray',
          paddingVertical: scale(16),
          position: 'absolute',
          bottom: 0,
        },
        slide: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // marginTop: scale(70),
        },
        txtDSM: {
          textAlign: 'center',
          marginTop: scale(24),
          color: colors['accent.blue100'],
        },
        txtNote: {
          textAlign: 'center',
          marginTop: scale(24),
          color: colors['label.secondary'],
        },
        btnContainer: {
          paddingVertical: scale(8),
          width: '100%',
        },
        btnLogin: {
          marginHorizontal: scale(16),
        },
        txtLogin: {
          color: ColorLight.white,
        },
        txtContact: {
          marginTop: scale(16),
          textAlign: 'center',
          color: colors['accent.blue100'],
        },
      }),
    [colors],
  );
};
