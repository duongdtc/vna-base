import { useTheme } from '@theme';
import { HairlineWidth } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        footerContainer: {
          paddingBottom: bottom + 12,
        },
        input: {
          color: colors.neutral900,
        },
        countryContainer: {
          padding: 11,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 8,
          borderWidth: HairlineWidth * 3,
          borderColor: colors.neutral300,
        },
      }),
    [bottom, colors.neutral300, colors.neutral900],
  );
};
