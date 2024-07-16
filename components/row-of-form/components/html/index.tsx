/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Icon, Text, WebViewAutoHeight } from '@vna-base/components';
import { CommonProps, HTMLProps } from '@vna-base/components/row-of-form/type';
import { navigate } from '@navigation/navigation-service';
import { useTheme } from '@theme';
import { APP_SCREEN } from '@utils';
import React, { useCallback, useMemo } from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStyles } from '../../styles';

export function HTML<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: HTMLProps & CommonProps<TFieldValues, TName>) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    t18n,
    control,
    name,
    isRequire,
    pattern,
    disable,
    ValueView,
    titleFontStyle,
    colorTheme = 'neutral100',
    processValue,
    sharedTransitionTag,
    t18nModal,
  } = props;

  const {
    field: { value: inputValue, onChange: onChangeText },
  } = useController({
    control: control,
    rules: {
      pattern,
      required: isRequire,
    },
    //@ts-ignore
    name: name,
  });

  const val = useMemo(() => {
    if (ValueView) {
      return ValueView(inputValue);
    }

    return inputValue;
  }, [ValueView, inputValue]);

  const _onChangeText = useCallback(
    (value: string) => onChangeText(processValue?.(value) ?? value),
    [onChangeText, processValue],
  );

  const content = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        font-weight: '400';
        line-height: 19px;
        font-style: normal;
        background-color: ${colors.neutral100}
      }
      p {
        color: ${colors.neutral900};
      }
      #main_div {
        overflow: scroll
      }
    </style>
    </head>
    <body>
    <div id="main_div">
    ${inputValue ?? ''}
    </div>
    </body>
    </html>
    `,
    [colors.neutral100, colors.neutral900, inputValue],
  );

  return (
    <Pressable
      disabled={disable}
      onPress={() => {
        navigate(APP_SCREEN.EDIT_HTML, {
          t18n: t18nModal ?? t18n,
          initValue: val,
          onDone: _onChangeText,
          sharedTransitionTag,
        });
      }}>
      <Animated.View
        // sharedTransitionStyle={transition}
        sharedTransitionTag={sharedTransitionTag}
        style={[
          styles.containerEditHTML,
          { rowGap: 4 },
          colorTheme && { backgroundColor: colors[colorTheme] },
        ]}>
        <Block
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Text
            t18n={t18n}
            colorTheme="neutral900"
            fontStyle={titleFontStyle ?? 'Title16Semi'}
          />
          <Icon icon="edit_2_fill" colorTheme="neutral700" size={20} />
        </Block>
        <WebViewAutoHeight content={content} />
      </Animated.View>
    </Pressable>
  );
}
