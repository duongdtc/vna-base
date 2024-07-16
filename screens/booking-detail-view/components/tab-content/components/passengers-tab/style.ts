import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          padding: 12,
        },
        row: {
          backgroundColor: colors.neutral100,
          borderWidth: 1,
          borderColor: colors.neutral300,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderRadius: 8,
          justifyContent: 'space-between',
        },
        inputContainer: {
          borderTopWidth: HairlineWidth * 3,
          borderColor: colors.neutral50,
          paddingVertical: scale(20),
          paddingLeft: scale(16),
          paddingRight: scale(12),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        input: { color: colors.neutral700 },
        bottomSheetItem: {
          padding: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(8),
        },
        selectedBottomSheetItem: {
          backgroundColor: colors.secondary50,
        },
      }),
    [colors],
  );
};
