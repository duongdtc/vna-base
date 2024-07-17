import {
  ActionSheet,
  Block,
  Button,
  NormalHeader,
  Text,
  showToast,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { goBack } from '@navigation/navigation-service';
import { configEmailActions } from '@vna-base/redux/action-slice';
import { ConfigEmailForm } from '@vna-base/screens/config-email/type';
import { HitSlop, dispatch } from '@vna-base/utils';
import React, { useCallback, useRef } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

const options: Array<OptionData> = [
  {
    t18n: 'booking:view_history',
    key: 'VIEW_HISTORY',
    icon: 'history_outline',
  },
];

export const Header = ({ openHistory }: { openHistory: () => void }) => {
  const { handleSubmit } = useFormContext<ConfigEmailForm>();
  const { isDirty } = useFormState();
  const actionSheetRefs = useRef<ActionSheet>(null);

  const save = useCallback(() => {
    handleSubmit(form => {
      dispatch(
        configEmailActions.updateConfigEmail(form, isSuccess => {
          if (isSuccess) {
            goBack();
          } else {
            showToast({
              type: 'error',
              t18n: 'common:failed',
            });
          }
        }),
      );
    })();
  }, [handleSubmit]);

  const onPressOption = (item: OptionData) => {
    switch (item.key) {
      case 'VIEW_HISTORY':
        openHistory();
        return;
    }
  };

  return (
    <>
      <NormalHeader
        zIndex={0}
        colorTheme="neutral100"
        shadow=".3"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            t18n="config_email:config_email"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
        rightContent={
          <Block flexDirection="row" columnGap={8}>
            {isDirty && (
              <Button
                type="common"
                size="small"
                leftIcon="saver_outline"
                textColorTheme="neutral900"
                leftIconSize={24}
                padding={4}
                onPress={save}
              />
            )}
            <Button
              type="common"
              size="small"
              leftIcon="more_vertical_outline"
              textColorTheme="neutral900"
              leftIconSize={24}
              padding={4}
              onPress={() => {
                actionSheetRefs.current?.show();
              }}
            />
          </Block>
        }
      />
      <ActionSheet
        type="select"
        ref={actionSheetRefs}
        onPressOption={onPressOption}
        option={options}
      />
    </>
  );
};
