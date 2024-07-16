import { Block, Icon, Separator, Text } from '@vna-base/components';
import {
  CustomNumberInputProps,
  PassengerPickerProps,
  SearchForm,
} from '@vna-base/screens/flight/type';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useController } from 'react-hook-form';
import { useStyles } from './styles';
import { TouchableOpacity } from 'react-native';
import { ActiveOpacity, HitSlop } from '@vna-base/utils';

function CustomNumberInput(props: CustomNumberInputProps) {
  const { value = 0, onChangeValue, max, min, t18nTitle, t18nSubTitle } = props;
  const styles = useStyles();
  const _increase = () => {
    onChangeValue(value + 1);
  };

  const _decrease = () => {
    onChangeValue(value - 1);
  };

  return (
    <Block flexDirection="row" paddingVertical={12} alignItems="center">
      <Block alignItems="flex-start" flex={1}>
        <Text
          t18n={t18nTitle}
          fontStyle="Title16Semi"
          colorTheme="neutral900"
        />
        <Text
          t18n={t18nSubTitle}
          fontStyle="Body12Reg"
          colorTheme="neutral600"
        />
      </Block>
      <Block flexDirection="row" columnGap={8} alignItems="center">
        <TouchableOpacity
          disabled={value === min}
          style={[styles.btn, value === min && { opacity: 0.3 }]}
          activeOpacity={ActiveOpacity}
          hitSlop={{ ...HitSlop.LargeInset, right: HitSlop.Small }}
          onPress={_decrease}>
          <Icon icon="minus_fill" size={16} colorTheme="neutral900" />
        </TouchableOpacity>
        <Text
          text={value.toString()}
          fontStyle="Title20Semi"
          colorTheme="neutral900"
          style={[
            styles.txtValue,
            // (value === min || value === max) && { opacity: 0.4 },
          ]}
        />
        <TouchableOpacity
          disabled={value === max}
          hitSlop={{ ...HitSlop.LargeInset, left: HitSlop.Small }}
          style={[styles.btn, value === max && { opacity: 0.4 }]}
          activeOpacity={ActiveOpacity}
          onPress={_increase}>
          <Icon icon="plus_fill" size={16} colorTheme="neutral900" />
        </TouchableOpacity>
      </Block>
    </Block>
  );
}

export const PassengerPicker = memo(({ style }: PassengerPickerProps) => {
  const {
    field: { onChange, value },
  } = useController<SearchForm, 'Passengers'>({
    name: 'Passengers',
    rules: {
      required: false,
    },
  });

  const _onChangeValue = (_value: { [key: string]: number }) => {
    onChange({ ...value, ..._value });
  };

  const _changeNumAdult = (_value: number) => {
    if (_value < (value?.Inf ?? 1)) {
      _onChangeValue({ Adt: _value, Inf: _value });
    } else {
      _onChangeValue({ Adt: _value });
    }
  };

  const _changeNumChildren = (_value: number) => {
    _onChangeValue({ Chd: _value });
  };

  const _changeNumBaby = (_value: number) => {
    _onChangeValue({ Inf: _value });
  };

  return (
    <Block paddingHorizontal={12} marginHorizontal={16} style={style}>
      <CustomNumberInput
        value={value?.Adt}
        onChangeValue={_changeNumAdult}
        max={9}
        min={1}
        t18nTitle={'flight:adult'}
        t18nSubTitle={'flight:from_12_yo'}
      />
      <Separator type="horizontal" />
      <CustomNumberInput
        value={value?.Chd}
        onChangeValue={_changeNumChildren}
        max={9}
        min={0}
        t18nTitle={'flight:children'}
        t18nSubTitle={'flight:from_2_to_under_12_yo'}
      />
      <Separator type="horizontal" />
      <CustomNumberInput
        value={value?.Inf}
        onChangeValue={_changeNumBaby}
        max={value?.Adt ?? 1}
        min={0}
        t18nTitle={'flight:infant'}
        t18nSubTitle={'flight:under_2_yo'}
      />
    </Block>
  );
}, isEqual);
