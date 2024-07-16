import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: top,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.neutral50,
          zIndex: 99,
          borderBottomWidth: HairlineWidth * 2,
          borderColor: colors.neutral300,
        },
        contentContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: scale(12),
        },
      }),
    [colors.neutral300, colors.neutral50, top],
  );
};
