import { useTheme } from '@theme';
import { FontDefault } from '@theme/typography';
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
        input: {
          backgroundColor: colors.neutral100,
          // margin: scale(16),
        },
        inputBase: {
          color: colors.neutral900,
        },
        itemContainer: {
          padding: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(8),
        },
        contentContainer: { paddingBottom: bottom },
        btnSearch: { marginHorizontal: scale(16) },
        inputPrice: {
          flex: 1,
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 12,
          borderColor: colors.neutral300,
          color: colors.neutral900,
          fontFamily: FontDefault.Regular,
          fontSize: 16,
          lineHeight: 19,
        },
      }),
    [bottom, colors],
  );
};
