import { useTheme } from '@theme';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { colors, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        tabBar: { backgroundColor: colors.neutral100 },
        pager: { backgroundColor: colors.neutral50 },
        tab: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        footerContainerWrapper: {},
        bottomContainer: {
          backgroundColor: colors.neutral100,
          paddingTop: scale(16),
          paddingHorizontal: scale(16),
          paddingBottom: bottom + 12,
          ...shadows.main,
        },
        remarkContentContainer: {
          padding: scale(12),
        },
        avatarImg: {
          width: scale(32),
          height: scale(32),
          borderRadius: scale(16),
        },
        textInput: {
          // flex: 1,
          // color: colors.neutral700,
          // borderColor: colors.neutral300,
          // marginBottom: 10,
          includeFontPadding: false, // for android vertical text centering
          padding: 0, // removal of default text input padding on android
          paddingTop: 0, // removal of iOS top padding for weird centering
          textAlignVertical: 'center', // for android vertical text centering
        },
        footerContainer: {
          paddingBottom: bottom,
          ...shadows.main,
        },
      }),
    [bottom, colors, shadows],
  );
};
