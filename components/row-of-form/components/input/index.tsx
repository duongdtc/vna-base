/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Icon, Text, TextInputShrink } from '@vna-base/components';
import { CommonProps, InputProps } from '@vna-base/components/row-of-form/type';
import { SortType } from '@services/axios';
import { translate } from '@vna-base/translations/translate';
import React, { useCallback, useMemo, useRef } from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { Pressable, TextInput } from 'react-native';
import { useStyles } from '../../styles';

export function Input<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: InputProps & CommonProps<TFieldValues, TName>) {
  const styles = useStyles();
  const inputRef = useRef<TextInput>(null);
  const {
    t18n,
    hideBottomSheet,
    control,
    name,
    isRequire,
    showStar,
    pattern,
    disable,
    fixedTitleFontStyle,
    t18nAll,
    ValueView,
    titleFontStyle,
    style,
    colorTheme = 'neutral100',
    processValue,
    validate,
    useBlur = false,
    ...input
  } = props;

  const {
    field: { value: inputValue, onChange: onChangeText, onBlur },
    fieldState: { invalid },
  } = useController({
    control: control,
    rules: {
      required: isRequire,
      validate,
      pattern,
    },
    //@ts-ignore
    name: name,
  });

  const {
    field: { value: orderBy, onChange: onChangeOrderBy },
  } = useController({
    control: control,
    //@ts-ignore
    name: 'OrderBy',
  });

  const {
    field: { value: sortType, onChange: onChangeSortType },
  } = useController({
    control: control,
    //@ts-ignore
    name: 'SortType',
  });

  const val = useMemo(() => {
    if (ValueView) {
      return ValueView(inputValue);
    }

    return inputValue;
  }, [ValueView, inputValue]);

  const _onPressTitle = useCallback(() => {
    if (hideBottomSheet) {
      if (orderBy !== name) {
        onChangeOrderBy(name);
      } else {
        onChangeSortType(
          sortType === SortType.Asc ? SortType.Desc : SortType.Asc,
        );
      }

      hideBottomSheet();
    } else {
      inputRef.current?.focus();
    }
  }, []);

  const _onChangeText = useCallback(
    (value: string) => onChangeText(processValue?.(value) ?? value),
    [onChangeText, processValue],
  );

  const _onBlur = () => {
    if (useBlur) {
      onChangeText(
        inputValue
          .replace(/[\s.]+/g, ' ')
          .toUpperCase()
          .replaceAll('Đ', 'D')
          .removeAccent()
          .trim(),
      );
      onBlur();
    }
  };

  return (
    <Block flexDirection="row" alignItems="center" colorTheme={colorTheme}>
      <Pressable
        disabled={disable}
        style={[
          styles.leftContainer,
          { paddingLeft: orderBy === name ? 8 : 16 },
        ]}
        onPress={_onPressTitle}>
        {hideBottomSheet && orderBy === name && (
          <Icon
            icon={sortType === SortType.Asc ? 'sort_up_fill' : 'sort_down_fill'}
            colorTheme="primary500"
            size={18}
          />
        )}
        <Text
          t18n={t18n}
          colorTheme="neutral900"
          fontStyle={
            titleFontStyle ??
            (!fixedTitleFontStyle && inputValue && inputValue !== ''
              ? 'Title16Semi'
              : 'Body16Reg')
          }
        />
        {(isRequire || showStar) && (
          <Text text="*" fontStyle="Body16Reg" colorTheme="error500" />
        )}
      </Pressable>
      <Pressable
        disabled={disable}
        onPress={() => {
          inputRef.current?.focus();
        }}
        style={styles.rightContainer}>
        <TextInputShrink
          ref={inputRef}
          rightIcon="edit_2_fill"
          rightIconSize={18}
          rightIconColorTheme={invalid ? 'error400' : 'neutral700'}
          onChangeText={_onChangeText}
          placeholder={translate(t18nAll)}
          // @ts-ignore
          value={val}
          textAlign="right"
          fontStyle="Body14Reg"
          placeholderTextColor={
            invalid ? styles.inputErr.color : styles.plhInput.color
          }
          styleInput={invalid ? styles.inputErr : [styles.input, style]}
          disable={disable}
          onBlur={_onBlur}
          {...input}
        />
      </Pressable>
    </Block>
  );
}
