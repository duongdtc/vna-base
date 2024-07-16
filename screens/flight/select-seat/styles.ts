import { useTheme } from '@theme';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        passengerItemContainer: {
          minWidth: scale(160),
          paddingHorizontal: scale(12),
          paddingVertical: scale(6),
          borderRadius: scale(8),
          backgroundColor: colors.neutral100,
          rowGap: scale(4),
          ...shadows.medium,
        },
        selectedPassengerItem: {
          borderWidth: HairlineWidth * 5,
          borderColor: colors.primary500,
        },
        contentContainer: {
          paddingHorizontal: scale(16),
          paddingVertical: scale(12),
        },
        footerContainer: { paddingBottom: bottom },
        btn: { margin: scale(12) },
        contentContainerListSeat: {
          backgroundColor: colors.neutral100,
          paddingBottom: scale(28),
        },
        seatContainer: {
          width: scale(28),
          height: scale(28),
          borderRadius: scale(4),
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        },
        enableSeat: {
          backgroundColor: colors.primary400,
        },
        selectedSeat: {
          borderWidth: HairlineWidth * 6,
          borderColor: colors.info500,
        },
        disableSeat: {
          backgroundColor: colors.neutral300,
        },
      }),
    [
      bottom,
      colors.info500,
      colors.neutral100,
      colors.neutral300,
      colors.primary400,
      colors.primary500,
      shadows.medium,
    ],
  );
};
