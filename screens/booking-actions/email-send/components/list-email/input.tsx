import { Icon } from '@vna-base/components';
import { rxEmail } from '@vna-base/utils';
import React, { memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useController, useFormContext } from 'react-hook-form';
import { LayoutAnimation, Pressable, TextInput } from 'react-native';
import { EmailSendForm } from '../../type';
import { useStyles } from './styles';

export const Input = memo(({ name }: { name: any }) => {
  const styles = useStyles();

  const { control, setFocus } = useFormContext<EmailSendForm>();

  const {
    field: { onChange, value, ref, onBlur },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    rules: { pattern: rxEmail, required: true },
  });

  const [isShowIcon, setIsShowIcon] = useState(true);

  const onFocus = () => {
    setIsShowIcon(false);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 160,
    });
  };

  const _onBlur = () => {
    onBlur();
    setIsShowIcon(true);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 160,
    });
  };

  const _setFocus = () => {
    setFocus(name);
  };

  return (
    <Pressable style={styles.inputContainer} onPress={_setFocus}>
      <TextInput
        ref={ref}
        onFocus={onFocus}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="done"
        onBlur={_onBlur}
        onChangeText={onChange}
        value={value}
        style={[styles.input, invalid && styles.inputError]}
      />
      {isShowIcon && (
        <Icon
          icon="edit_2_fill"
          colorTheme={invalid ? 'error500' : 'neutral700'}
          size={20}
        />
      )}
    </Pressable>
  );
}, isEqual);
