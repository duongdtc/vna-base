import { useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { HairlineWidth, scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = () => {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: top,
        },
        mainContainer: {
          padding: scale(12),
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          columnGap: scale(8),
        },
        closeBtn: {
          position: 'absolute',
          right: scale(52),
        },
        inputContainer: {
          position: 'absolute',
          flexDirection: 'row',
          right: scale(52),
          borderRadius: scale(4),
          borderWidth: HairlineWidth * 2,
          backgroundColor: colors.neutral100,
        },
        textInput: {
          flex: 1,
          color: colors.neutral900,
          paddingRight: 28,
          paddingVertical: 0,
          ...FontStyle.Body14Reg,
        },
        placeholder: {
          color: colors.neutral400,
        },
      }),
    [colors.neutral100, colors.neutral400, colors.neutral900, top],
  );
};
