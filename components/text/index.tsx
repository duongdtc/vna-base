import React, { forwardRef, useMemo } from 'react';
import {
  Text as ReactNativeText,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { propsToStyle } from '@utils';

import { TextProps } from './type';
import { useStyles } from '@theme';
import { textPresets } from '@theme/typography';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export const Text = forwardRef<ReactNativeText, TextProps>(
  (
    {
      t18n,
      text,
      flex,
      color,
      center,
      children,
      textAlign,
      fontStyle,
      colorTheme,
      t18nOptions,
      textTransform,
      style: styleOverride = {},
      ...rest
    },
    ref,
  ) => {
    // state
    const {
      theme: { colors },
    } = useStyles();

    const [t] = useTranslation();

    const i18nText = useMemo(
      () => t18n && t(t18n, t18nOptions),
      [t18n, t18nOptions, t],
    );

    const content = useMemo(
      () => i18nText || text || children,
      [i18nText, text, children],
    );

    const styleComponent = useMemo<StyleProp<TextStyle> | undefined>(
      () => [
        [
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          textPresets[fontStyle],
          flex === true && styles.flex,
          colorTheme !== undefined && { color: colors[colorTheme] },
          center && { textAlign: 'center' },
          propsToStyle([{ color }, { textAlign }, { textTransform }]),
        ],
      ],
      [
        flex,
        colorTheme,
        colors,
        center,
        color,
        textAlign,
        textTransform,
        fontStyle,
      ],
    );

    // render
    return (
      <ReactNativeText
        ref={ref}
        {...rest}
        style={[styleComponent, styleOverride]}>
        {content}
      </ReactNativeText>
    );
  },
);
