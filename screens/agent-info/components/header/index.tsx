import { Button, NormalHeader, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { selectCurrentAccount } from '@vna-base/redux/selector';
import { agentActions } from '@vna-base/redux/action-slice';
import { FormAgentInfoType } from '@vna-base/screens/agent-info/type';
import { dispatch } from '@vna-base/utils';
import React from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';

export const HeaderAgentInfo = () => {
  const { Agent } = useSelector(selectCurrentAccount);

  const { control, handleSubmit } = useFormContext<FormAgentInfoType>();

  const { isDirty, dirtyFields } = useFormState<FormAgentInfoType>({
    control,
  });

  const _save = () => {
    handleSubmit(formData => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        agentActions.updateAgentDetail(Agent?.Id, formData, dirtyFields, () => {
          // dispatch(authenticationActions.getCurrentAccount());
        }),
      );
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

  // render
  return (
    <NormalHeader
      colorTheme="neutral10"
      leftContent={
        <Button
          leftIcon="arrow_ios_left_outline"
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
          t18n="system:info_agent"
          colorTheme="neutral900"
        />
      }
      rightContent={renderRightContent()}
    />
  );
};
