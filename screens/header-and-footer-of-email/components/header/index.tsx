import {
  ActionSheet,
  Block,
  Button,
  NormalHeader,
  Text,
  showToast,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { configEmailActions, contentActions } from '@redux-slice';
import { TitleAndRemarkForm } from '@vna-base/screens/title-and-remark-of-ticket/type';
import {
  HitSlop,
  ObjectField,
  ObjectHistoryTypes,
  dispatch,
  getState,
} from '@vna-base/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { MoreOptionActionSheet } from '../more-option-action-sheet';

export const Header = () => {
  const actionSheetRef = useRef<ActionSheet>(null);
  const { handleSubmit } = useFormContext<TitleAndRemarkForm>();
  const { isDirty } = useFormState<TitleAndRemarkForm>();
  const headerId = useWatch<TitleAndRemarkForm>({ name: 'Header.Id' });

  const [isShowSaveBtn, setIsShowSaveBtn] = useState(false);

  useEffect(() => {
    let timeId: NodeJS.Timeout | null = null;

    if (isDirty) {
      timeId = setTimeout(() => {
        setIsShowSaveBtn(true);
      }, 200);
    } else {
      setIsShowSaveBtn(false);
    }

    return () => {
      if (timeId !== null) {
        clearTimeout(timeId);
      }
    };
  }, [isDirty]);

  const submit = useCallback(() => {
    const { Id } = getState('configEmail').configEmail;

    handleSubmit(form => {
      dispatch(
        contentActions.updateOrInsert(
          [
            {
              ObjectId: Id,
              ObjectType: ObjectHistoryTypes.CONFIG_EMAIL,
              Id: form.Header.Id,
              ObjectField: ObjectField.Header,
              Language: form.language,
              Data: form.Header.Data,
            },
            {
              ObjectId: Id,
              ObjectType: ObjectHistoryTypes.CONFIG_EMAIL,
              Id: form.Footer.Id,
              ObjectField: ObjectField.Footer,
              Language: form.language,
              Data: form.Footer.Data,
            },
          ],
          isSuccess => {
            if (isSuccess) {
              goBack();

              dispatch(configEmailActions.getLanguages());
            } else {
              showToast({
                type: 'error',
                t18n: 'common:failed',
              });
            }
          },
        ),
      );
    })();
  }, [handleSubmit]);

  return (
    <NormalHeader
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
          t18n="config_ticket:title_and_remark"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
      }
      rightContent={
        <Block flexDirection="row" alignItems="center" columnGap={8}>
          {isShowSaveBtn && (
            <Button
              type="common"
              size="small"
              leftIcon="saver_outline"
              textColorTheme="neutral900"
              leftIconSize={24}
              padding={4}
              onPress={submit}
            />
          )}
          {headerId && (
            <>
              <Button
                type="common"
                size="small"
                leftIcon="more_vertical_outline"
                textColorTheme="neutral900"
                leftIconSize={24}
                padding={4}
                onPress={() => {
                  actionSheetRef.current?.show();
                }}
              />
              <MoreOptionActionSheet ref={actionSheetRef} />
            </>
          )}
        </Block>
      }
    />
  );
};
