import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: { paddingBottom: bottom },
        itemContainer: {
          padding: scale(16),
          flexDirection: 'row',
          borderBottomWidth: HairlineWidth,
          borderColor: colors.neutral200,
          alignItems: 'center',
          backgroundColor: colors.neutral100,
        },
        selectedItem: { backgroundColor: colors.secondary50 },
      }),
    [bottom, colors.neutral100, colors.neutral200, colors.secondary50],
  );
};
