import { Button, NormalHeader, Text, showModalConfirm } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { TaxInfo } from '@vna-base/screens/flight/type';
import React, { useCallback } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

export const Header = ({ onSubmit }: { onSubmit: () => void }) => {
  const { control, reset } = useFormContext<TaxInfo>();

  const { isValid } = useFormState({
    control,
  });

  const _resetForm = useCallback(() => {
    showModalConfirm({
      t18nTitle: 'flight:reset_data',
      t18nSubtitle: 'flight:des_reset',
      t18nCancel: 'common:cancel',
      t18nOk: 'input_info_passenger:submit',
      themeColorCancel: 'neutral50',
      themeColorTextCancel: 'neutral900',
      themeColorOK: 'primary600',
      onOk: () => {
        reset({
          Address: '',
          CompanyName: '',
          TIN: '',
          ReceiverInfo: {
            FullName: '',
            CountryCode: 'VN',
            Email: '',
            Address: '',
            Note: '',
            PhoneNumber: '',
          },
        });

        onSubmit();
      },
      flexDirection: 'row',
    });
  }, [onSubmit, reset]);

  return (
    <NormalHeader
      leftContent={
        <Button
          leftIcon="arrow_ios_left_outline"
          leftIconSize={24}
          padding={4}
          textColorTheme="neutral900"
          onPress={() => {
            goBack();
          }}
        />
      }
      centerContent={
        <Text
          fontStyle="Title20Semi"
          t18n="tax_info:tax_info"
          colorTheme="neutral900"
        />
      }
      rightContent={
        <Button
          leftIcon="repeat_fill"
          leftIconSize={24}
          padding={4}
          textColorTheme="neutral900"
          onPress={_resetForm}
          disabled={!isValid}
        />
      }
    />
  );
};
