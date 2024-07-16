import { useTheme } from '@theme';
import { HairlineWidth } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.neutral50,
          borderTopWidth: HairlineWidth * 2,
          borderColor: colors.neutral300,
          overflow: 'hidden',
        },
        contentContainer: {
          paddingBottom: bottom + 6,
          paddingTop: 10,
          alignItems: 'center',
          paddingHorizontal: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: colors.neutral50,
        },
      }),
    [bottom, colors.neutral300, colors.neutral50],
  );
};
