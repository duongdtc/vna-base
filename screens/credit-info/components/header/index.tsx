import { Button, NormalHeader, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { selectAgentDetailById } from '@redux-selector';
import { agentActions } from '@redux-slice';
import { CreditInfoForm } from '@vna-base/screens/credit-info/type';
import { HitSlop, dispatch } from '@vna-base/utils';
import React from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';

export const Header = () => {
  const { Id } = useSelector(selectAgentDetailById);

  const { control, handleSubmit } = useFormContext<CreditInfoForm>();

  const { isDirty } = useFormState<CreditInfoForm>({
    control,
  });

  const parseNumber = (str: string) => {
    return parseFloat(str.replace(/,/g, ''));
  };

  const _save = () => {
    handleSubmit(formData => {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          formData[key] = parseNumber(value!);
        }
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      formData.Id = Id;

      dispatch(agentActions.updateBalanceAgent(formData, () => goBack()));
    })();
  };

  const renderRightContent = () => {
    return (
      isDirty && (
        <Button
          type="common"
          size="small"
          leftIcon="saver_outline"
          textColorTheme="neutral900"
          leftIconSize={24}
          padding={4}
          onPress={_save}
        />
      )
    );
  };

  return (
    <NormalHeader
      colorTheme="neutral100"
      leftContent={
        <Button
          hitSlop={HitSlop.Large}
          leftIcon="arrow_ios_left_fill"
          leftIconSize={24}
          textColorTheme="neutral900"
          onPress={() => {
            goBack();
          }}
          padding={4}
        />
      }
      centerContent={
        <Text
          fontStyle="Title20Semi"
          t18n="credit_info:credit"
          colorTheme="neutral900"
        />
      }
      rightContent={renderRightContent()}
      borderBottomWidth={10}
      borderColorTheme="neutral200"
    />
  );
};
