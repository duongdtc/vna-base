import {
  ActionSheet,
  Block,
  Button,
  NormalHeader,
  Text,
  showModalConfirm,
  showToast,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { goBack } from '@navigation/navigation-service';
import Clipboard from '@react-native-clipboard/clipboard';
import { selectCurrentAccount, selectUserAccount } from '@vna-base/redux/selector';
import { userAccountActions, userSubAgentActions } from '@vna-base/redux/action-slice';
import {
  PersonalInfoForm,
  listOptionItemSubAgtAcc,
} from '@vna-base/screens/personal-info/type';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import { HitSlop, delay, dispatch, getState, scale } from '@vna-base/utils';
import React, { useCallback, useMemo, useRef } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';

type Props = {
  id?: string;
  titleName?: string;
  userSubAgtWithAgtId?: string;
  openHistory: () => void;
};

export const Header = (props: Props) => {
  const { id, titleName, userSubAgtWithAgtId, openHistory } = props;

  const actionSheetRef = useRef<ActionSheet>(null);

  const { Id } = useSelector(selectCurrentAccount);
  const userAccount = useSelector(selectUserAccount(id!));

  const { handleSubmit } = useFormContext<PersonalInfoForm>();
  const { isDirty } = useFormState();

  const save = useCallback(() => {
    handleSubmit(form => {
      if (userSubAgtWithAgtId) {
        dispatch(
          userSubAgentActions.updateUserSubAgt(form, () => {
            goBack();
          }),
        );
      } else {
        dispatch(
          userAccountActions.updateUserAccount(form, () => {
            const filterFormListUserAccount =
              getState('userAccount').filterForm;
            dispatch(
              userAccountActions.getListUserAccount(filterFormListUserAccount!),
            );
          }),
        );
      }
    })();
  }, [handleSubmit, userSubAgtWithAgtId]);

  const listOption = useMemo(() => {
    const temp = [...listOptionItemSubAgtAcc];

    if (!userAccount?.Visible) {
      temp[2] = {
        t18n: 'agent_detail:restore_sub_agt_acc',
        key: 'RESTORE',
        icon: 'undo_outline',
      };
    }

    return temp;
  }, [userAccount]);

  const _resetPassword = useCallback(() => {
    showModalConfirm({
      t18nTitle: 'agent_detail:title_recreated_acc',
      renderBody: () => (
        <Text fontStyle="Body14Reg" colorTheme="neutral800" textAlign="center">
          {translate('agent:accounts') + ': '}
          <Text
            text={userAccount?.Username as string}
            fontStyle="Body14Semi"
            colorTheme="neutral900"
          />
        </Text>
      ),
      t18nCancel: 'common:cancel',
      themeColorCancel: 'neutral50',
      themeColorTextCancel: 'neutral900',
      t18nOk: 'common:reset',
      themeColorOK: 'warning600',
      themeColorTextOK: 'classicWhite',
      flexDirection: 'row',
      onOk: () =>
        dispatch(
          userSubAgentActions.resetUserSubAgt(
            userAccount?.Id as string,
            async data => {
              await delay(500);
              showModalConfirm({
                lottie: 'done',
                lottieStyle: {
                  width: scale(182),
                  height: scale(72),
                },
                t18nTitle: 'agent_detail:change_pass_success',
                t18nCancel: 'modal_confirm:copy',
                themeColorCancel: 'success500',
                themeColorTextCancel: 'classicWhite',
                renderBody: () => (
                  <Block rowGap={16}>
                    <Text
                      fontStyle="Body14Reg"
                      colorTheme="neutral800"
                      textAlign="center">
                      {translate('agent:accounts') + ': '}
                      <Text
                        text={data.Username as string}
                        fontStyle="Body14Semi"
                        colorTheme="neutral900"
                      />
                    </Text>
                    <Text
                      fontStyle="Body14Reg"
                      colorTheme="neutral800"
                      textAlign="center">
                      {translate('common:password') + ': '}
                      <Text
                        text={data.Password as string}
                        fontStyle="Body14Semi"
                        colorTheme="neutral800"
                      />
                    </Text>
                  </Block>
                ),
                onCancel: () => {
                  Clipboard.setString(
                    `${translate('agent:accounts')}: ${
                      data.Username
                    }\n${translate('common:password')}: ${data.Password}`,
                  );
                  showToast({
                    type: 'success',
                    t18n: 'common:done',
                  });
                },
              });
            },
          ),
        ),
    });
  }, [userAccount?.Id, userAccount?.Username]);

  const onPressOption = (item: OptionData) => {
    if (item.key === 'VIEW_HISTORY') {
      openHistory();
      return;
    }

    if (item.key === 'RESET_PASS') {
      _resetPassword();
      return;
    }

    if (item.key === 'DELETE') {
      showModalConfirm({
        t18nTitle: 'agent_detail:delete_sub_agt_acc',
        renderBody: () => (
          <Text
            fontStyle="Body14Reg"
            colorTheme="neutral800"
            textAlign="center">
            {translate('agent:accounts') + ': '}
            <Text
              text={userAccount?.Username as string}
              fontStyle="Body14Semi"
              colorTheme="neutral900"
            />
          </Text>
        ),
        t18nSubtitle: 'agent_detail:note_deleted',
        t18nCancel: 'common:cancel',
        themeColorCancel: 'neutral50',
        themeColorTextCancel: 'neutral900',
        t18nOk: 'common:delete',
        themeColorOK: 'error500',
        themeColorTextOK: 'classicWhite',
        flexDirection: 'row',
        onOk: () => {
          dispatch(
            userAccountActions.deleteUserAccount(userAccount?.Id as string),
          );
          goBack();
        },
      });

      return;
    }

    if (item.key === 'RESTORE') {
      showModalConfirm({
        t18nTitle: 'agent_detail:restore_sub_agt_acc',
        renderBody: () => (
          <Text
            fontStyle="Body14Reg"
            colorTheme="neutral800"
            textAlign="center">
            {translate('agent:accounts') + ': '}
            <Text
              text={userAccount?.Username as string}
              fontStyle="Body14Semi"
              colorTheme="neutral900"
            />
          </Text>
        ),
        t18nCancel: 'common:cancel',
        themeColorCancel: 'neutral50',
        themeColorTextCancel: 'neutral900',
        t18nOk: 'common:confirm',
        themeColorOK: 'success500',
        themeColorTextOK: 'classicWhite',
        onOk: () => {
          dispatch(
            userAccountActions.restoreUserAccount(userAccount.Id!, async () => {
              await delay(500);
              showModalConfirm({
                lottie: 'done',
                lottieStyle: {
                  width: scale(182),
                  height: scale(72),
                },
                t18nTitle: 'agent_detail:restore_success',
                t18nCancel: 'modal_confirm:close',
                themeColorCancel: 'neutral50',
                themeColorTextCancel: 'neutral900',
                renderBody: () => (
                  <Text
                    fontStyle="Body14Reg"
                    colorTheme="neutral800"
                    textAlign="center">
                    {translate('agent:accounts') + ': '}
                    <Text
                      text={userAccount?.Username as string}
                      fontStyle="Body14Semi"
                      colorTheme="neutral900"
                    />
                  </Text>
                ),
              });
              goBack();
            }),
          );
        },
        flexDirection: 'row',
      });
      return;
    }
  };

  return (
    <>
      <NormalHeader
        zIndex={0}
        colorTheme="neutral100"
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
            t18n={titleName as I18nKeys}
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
        rightContent={
          <Block flexDirection="row" columnGap={8} alignItems="center">
            {id !== undefined && isDirty ? (
              <Button
                type="common"
                size="small"
                leftIcon="saver_outline"
                textColorTheme="neutral900"
                leftIconSize={24}
                padding={4}
                onPress={save}
              />
            ) : undefined}
            {id !== Id && id !== undefined && (
              <>
                <Button
                  type="common"
                  size="small"
                  leftIcon="more_vertical_outline"
                  textColorTheme="neutral900"
                  leftIconSize={20}
                  padding={4}
                  onPress={() => actionSheetRef.current?.show()}
                />
                <ActionSheet
                  type="select"
                  typeBackDrop="gray"
                  ref={actionSheetRef}
                  onPressOption={onPressOption}
                  option={listOption}
                />
              </>
            )}
          </Block>
        }
      />
    </>
  );
};
