import React, { useMemo } from 'react';

import { useController, useFormContext } from 'react-hook-form';

import { TextInput } from '@vna-base/components';
import { PresentType, TextInputProps } from '@vna-base/components/text-input/type';
import { FormLoginType } from '@vna-base/screens/login/type';
import { useErrorMessageTranslation } from '@vna-base/utils/hooks';
import isEmpty from 'lodash.isempty';

interface InputProps<T extends Record<string, any>>
  extends CustomOmit<TextInputProps, 'nameTrigger'>,
    React.RefAttributes<any> {
  name: keyof T;
  nameTrigger?: keyof T;
}

export const Input = <T extends Record<string, any>>({
  label,
  name,
  nameTrigger,
  defaultValue = '',
  ...rest
}: InputProps<T>) => {
  // state
  const { trigger, getValues } = useFormContext<FormLoginType>();

  const {
    field: { ref, onBlur, onChange },
    fieldState: { error },
  } = useController({
    name: name as string,
    defaultValue,
  });

  const message = useErrorMessageTranslation(error?.message);

  const _present = useMemo<PresentType>(() => {
    switch (true) {
      case isEmpty(message) && isEmpty(error):
        return 'normal';

      default:
        return 'error';
    }
  }, [error, message]);

  // render
  return (
    <>
      <TextInput
        ref={ref}
        nameTrigger={nameTrigger as string}
        trigger={trigger}
        label={label}
        present={_present}
        // enableHelperText
        helperText={message}
        onChangeText={onChange}
        onBlur={onBlur}
        defaultValue={(getValues() as Record<string, string>)[name as string]}
        placeholderTextColorTheme="secondary400"
        {...rest}
      />
    </>
  );
};
