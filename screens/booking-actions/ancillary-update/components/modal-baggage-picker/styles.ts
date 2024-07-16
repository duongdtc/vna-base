import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        itemContainer: {
          paddingHorizontal: scale(16),
          paddingVertical: scale(12),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 4,
        },
        selectedItem: { backgroundColor: colors.primary50 },
        contentContainer: { paddingBottom: bottom },
      }),
    [bottom, colors.primary50],
  );
};
