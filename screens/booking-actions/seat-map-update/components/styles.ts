import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        btnItemService: {
          borderRadius: scale(8),
          padding: scale(12),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        flightItemContainerCommon: { marginBottom: scale(12) },
        flightItemContainer: {
          borderRadius: 8,
          borderWidth: HairlineWidth * 3,
          overflow: 'hidden',
          borderColor: colors.neutral200,
        },
        flightItemContainerNoWrap: {},
        segmentHeader: {
          flexDirection: 'row',
          padding: 8,
          backgroundColor: colors.neutral50,
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        contentContainer: {
          paddingBottom: 12,
        },
        servicePassengerItem: {
          paddingVertical: scale(12),
        },
      }),
    [colors.neutral200, colors.neutral50],
  );
};
