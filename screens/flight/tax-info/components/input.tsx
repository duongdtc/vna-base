import React from 'react';

import { useController, useFormContext } from 'react-hook-form';

import { TextInput } from '@vna-base/components';
import { TextInputProps } from '@vna-base/components/text-input/type';
import { TaxInfo } from '@vna-base/screens/flight/type';

interface InputProps
  extends CustomOmit<TextInputProps, 'nameTrigger'>,
    React.RefAttributes<any> {
  name: string;
  nameTrigger?: string;
}

export const Input = ({
  label,
  name,
  nameTrigger,
  defaultValue = '',
  ...rest
}: InputProps) => {
  // state
  const { trigger } = useFormContext<TaxInfo>();

  const {
    field: { ref, onBlur, onChange, value },
    // fieldState: { error },
  } = useController({
    name: name,
    defaultValue,
  });

  // const message = useErrorMessageTranslation(error?.message);

  // const _present = useMemo<PresentType>(() => {
  //   switch (true) {
  //     case isEmpty(message) && isEmpty(error):
  //       return 'normal';

  //     default:
  //       return 'error';
  //   }
  // }, [error, message]);

  // render
  return (
    <>
      <TextInput
        ref={ref}
        nameTrigger={nameTrigger as string}
        trigger={trigger}
        label={label}
        // present={_present}
        // enableHelperText
        // helperText={message}
        onChangeText={onChange}
        onBlur={onBlur}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        defaultValue={value}
        placeholderTextColorTheme="secondary400"
        {...rest}
      />
    </>
  );
};
