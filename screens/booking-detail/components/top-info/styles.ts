import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        headerBtn: {
          flex: 1,
          padding: scale(8),
          flexDirection: 'row',
          borderRadius: scale(4),
          overflow: 'hidden',
          alignItems: 'center',
        },
        stateBtn: {
          justifyContent: 'space-between',
          backgroundColor: colors.neutral50,
          borderWidth: HairlineWidth * 2,
          borderColor: colors.neutral200,
        },
        actionBtn: { justifyContent: 'center', columnGap: scale(8) },
        statusItemContainer: {
          padding: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(8),
        },
        selectedStatusItemContainer: {
          backgroundColor: colors.primary50,
        },
      }),
    [colors.neutral200, colors.neutral50, colors.primary50],
  );
};
