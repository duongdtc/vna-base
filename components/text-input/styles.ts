import { useTheme } from '@theme';
import { FontDefault, FontStyle } from '@theme/typography';
import { scale } from '@vna-base/utils';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        input: {
          flex: 1,
          color: colors.neutral900,
          paddingHorizontal: scale(0),
        },
        paddingLeft8: {
          paddingLeft: scale(8),
        },
        paddingRight8: {
          paddingRight: scale(8),
        },
        paddingLeft4: {
          paddingLeft: scale(4),
        },
        paddingRight4: {
          paddingRight: scale(4),
        },
        containerInput: {
          flexDirection: 'row',
          paddingHorizontal: scale(12),
          alignItems: 'center',
          backgroundColor: colors.neutral100,
          // overflow: 'hidden',
        },
        containerInputLarge: { borderRadius: scale(8), height: scale(48) },
        containerInputSmall: {
          borderRadius: scale(4),
          height: scale(36),
          paddingHorizontal: scale(4),
          justifyContent: 'center',
        },
        multiline: {
          height: scale(100),
          paddingTop: scale(10),
        },
        rowLabel: {
          zIndex: 1,
          position: 'absolute',
          paddingHorizontal: scale(2),
          backgroundColor: colors.neutral100,
        },
        label: { fontFamily: FontDefault.Regular },
        star: {
          color: colors.error400,
        },
        filled: {
          backgroundColor: colors.neutral50,
        },
        largeInput: {
          ...FontStyle.Body16Reg,
          paddingVertical: scale(12),
        },
        smallInput: {
          ...FontStyle.Body14Reg,
          paddingVertical: scale(6),
        },
        border: {
          ...StyleSheet.absoluteFillObject,
        },
      }),
    [colors],
  );
};
