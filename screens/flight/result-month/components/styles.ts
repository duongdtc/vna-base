import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { FontStyle } from '@theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        rightHeader: { alignItems: 'center', gap: scale(4) },
        contentContainer: {
          backgroundColor: colors.neutral50,
          paddingTop: scale(12),
          rowGap: scale(12),
        },
        customCellTextStyleToday: {
          color: colors.primary600,
        },
        customCellTextStyleWeekendDay: {
          color: colors.primary600,
        },
        customCellTextStyleNormalDay: {
          ...FontStyle.Title16Semi,
          color: colors.neutral900,
        },
        customCellTextStyleDisabledDay: {
          //   color: colors.neutral400,
          opacity: 0.4,
        },
        customHeaderStyleForMonthViewNormalText: {
          ...FontStyle.Capture11Bold,
        },
        customHeaderStyleForMonthViewWeekendText: {
          color: colors.primary600,
        },
        customHeaderStyleForMonthViewWeekText: {
          color: colors.neutral700,
        },
        customHeaderStyleForMonthViewContainer: {
          backgroundColor: colors.primary50,
          marginBottom: scale(10),
        },
        calendarCellStyle: {
          height: scale(48),
          backgroundColor: colors.neutral100,
        },
        minPriceItem: {
          flexDirection: 'row',
          padding: scale(8),
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.neutral100,
        },
        bottomContainer: {
          paddingBottom: bottom,
          backgroundColor: colors.neutral100,
          ...shadows.main,
        },
        bottomBtn: {
          padding: scale(8),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: scale(8),
        },
        filterContentContainer: { paddingHorizontal: scale(12) },
        airlineItem: {
          paddingHorizontal: scale(4),
          paddingVertical: scale(20),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      }),
    [
      bottom,
      colors.neutral100,
      colors.neutral50,
      colors.neutral700,
      colors.neutral900,
      colors.primary50,
      colors.primary600,
      shadows.main,
    ],
  );
};
