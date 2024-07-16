/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Text, TextInputShrink } from '@components';
import { CommonProps, InputProps } from '@components/row/type';
import { translate } from '@translations/translate';
import React, { useMemo, useRef } from 'react';
import { Pressable, TextInput } from 'react-native';
import { useStyles } from '../../styles';
import { useTheme } from '@theme';

export function Input(props: InputProps & CommonProps) {
  const styles = useStyles();
  const inputRef = useRef<TextInput>(null);
  const {
    t18n,
    value,
    onChangeText,
    disable,
    fixedTitleFontStyle,
    t18nAll = 'common:not_fill',
    ValueView,
    titleFontStyle,
    styleInput: styleInput,
    colorTheme = 'neutral100',
    ...input
  } = props;
  const { colors } = useTheme();

  const val = useMemo(() => {
    if (ValueView) {
      return ValueView(value);
    }

    return value;
  }, [ValueView, value]);

  return (
    <Pressable
      disabled={disable}
      style={[
        styles.container,
        colorTheme && { backgroundColor: colors[colorTheme] },
      ]}
      onPress={() => {
        inputRef.current?.focus();
      }}>
      <Text
        t18n={t18n}
        colorTheme="neutral900"
        fontStyle={
          titleFontStyle ??
          (!fixedTitleFontStyle && value && value !== ''
            ? 'Title16Semi'
            : 'Body16Reg')
        }
      />

      <Block style={styles.rightContainer}>
        <TextInputShrink
          ref={inputRef}
          rightIcon="edit_2_fill"
          rightIconSize={18}
          rightIconColorTheme={'neutral700'}
          onChangeText={onChangeText}
          placeholder={translate(t18nAll)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value={val}
          textAlign="right"
          fontStyle="Body14Reg"
          placeholderTextColor={styles.plhInput.color}
          styleInput={[styles.input, styleInput]}
          disable={disable}
          {...input}
        />
      </Block>
    </Pressable>
  );
}
