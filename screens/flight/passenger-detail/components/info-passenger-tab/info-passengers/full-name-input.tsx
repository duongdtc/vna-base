import { Block, TextInput } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { MaxLengthFullName, rxSpecialAndNumber } from '@vna-base/utils';
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useStyles, createStyleSheet } from '@theme';

export const FullNameInput = ({ index }: { index: number }) => {
  const { styles } = useStyles(styleSheet);
  const { control } = useFormContext<PassengerForm>();

  const splitFullName = useWatch({
    control,
    name: 'SplitFullName',
  });

  useWatch({
    control,
    name: 'Passengers',
  });

  return splitFullName ? (
    <Block rowGap={16}>
      <Controller
        control={control}
        name={`Passengers.${index}.Surname`}
        rules={{
          required: true,
          pattern: rxSpecialAndNumber,
        }}
        render={({
          field: { value, onChange, onBlur, ref },
          fieldState: { invalid },
        }) => (
          <TextInput
            ref={ref}
            required={true}
            textContentType="nameSuffix"
            labelI18n="input_info_passenger:last_name"
            placeholderTextColor={styles.fullNameInput.color}
            defaultValue={value}
            autoCapitalize="characters"
            keyboardType="default"
            autoComplete="name-suffix"
            maxLength={MaxLengthFullName}
            present={invalid ? 'error' : 'normal'}
            onBlur={() => {
              onChange(
                value
                  .replace(/[\s.]+/g, ' ')
                  .toUpperCase()
                  .removeAccent()
                  .trim(),
              );

              onBlur();
            }}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name={`Passengers.${index}.GivenName`}
        rules={{
          required: true,
          pattern: rxSpecialAndNumber,
        }}
        render={({
          field: { value, onChange, onBlur, ref },
          fieldState: { invalid },
        }) => (
          <TextInput
            ref={ref}
            required={true}
            autoComplete="name-prefix"
            textContentType="namePrefix"
            autoCapitalize="characters"
            labelI18n="input_info_passenger:first_name"
            placeholderTextColor={styles.fullNameInput.color}
            defaultValue={value}
            maxLength={MaxLengthFullName}
            present={invalid ? 'error' : 'normal'}
            onBlur={() => {
              onChange(
                value
                  .replace(/[\s.]+/g, ' ')
                  .toUpperCase()
                  .removeAccent()
                  .trim(),
              );

              onBlur();
            }}
            onChangeText={onChange}
          />
        )}
      />
    </Block>
  ) : (
    <Controller
      control={control}
      name={`Passengers.${index}.FullName`}
      rules={{
        required: true,
        pattern: rxSpecialAndNumber,
      }}
      render={({
        field: { value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <TextInput
          ref={ref}
          required={true}
          textContentType="name"
          labelI18n="input_info_passenger:full_name"
          placeholderTextColor={styles.fullNameInput.color}
          defaultValue={value}
          maxLength={MaxLengthFullName}
          autoComplete="name"
          present={invalid ? 'error' : 'normal'}
          onBlur={() => {
            onChange(
              value
                .replace(/[\s.]+/g, ' ')
                .toUpperCase()
                .removeAccent()
                .trim(),
            );

            onBlur();
          }}
          onChangeText={onChange}
          autoCapitalize="characters"
        />
      )}
    />
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  fullNameInput: {
    color: colors.neutral60,
  },
}));
