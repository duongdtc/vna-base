import {
  Block,
  BottomSheetHistory,
  BottomSheetHistoryRef,
  Screen,
  Text,
  showModalConfirm,
  showToast,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  selectCurrentAccount,
  selectUserAccount,
  selectUserSubAgent,
} from '@vna-base/redux/selector';
import {
  userAccountActions,
  userSubAgentActions,
} from '@vna-base/redux/action-slice';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import { ObjectHistoryTypes, dispatch, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Header, MainContent } from './components';
import { PersonalInfoForm } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';
import { createStyleSheet, useStyles } from '@theme';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Avatar } from '@screens/personal-info/avatar';

export const RegularCustomers = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.REGULAR_CUSTOMERS
>) => {
  const { styles } = useStyles(styleSheet);
  const { id, userSubAgtWithAgtId } = route.params;

  const bottomSheetRef = useRef<BottomSheetHistoryRef>(null);

  const { Id } = useSelector(selectCurrentAccount);
  const userAccount = useSelector(selectUserAccount(id!));
  const userSubAgent = useSelector(selectUserSubAgent);

  const formMethod = useForm<PersonalInfoForm>({});

  useEffect(() => {
    if (userSubAgtWithAgtId) {
      dispatch(userSubAgentActions.getUserSubAgentById(id!));
    }

    if (isEmpty(userAccount)) {
      dispatch(userAccountActions.getUserAccount(id!));
    }
  }, [id, userSubAgtWithAgtId]);

  const isDifferentWithCurrentUserAccountAndNew = useMemo(
    () => (id === undefined || id !== Id ? true : false),
    [Id, id],
  );

  useEffect(() => {
    if (id === undefined) {
      formMethod.reset({
        Id: undefined,
        Photo: null,
        Email: null,
        FullName: null,
        Phone: null,
        Username: null,
        AllowBook: false,
        AllowIssue: false,
        AllowSearch: false,
        AllowVoid: false,
        UserGroupId: null,
        Status: false,
        Remark: null,
        SISetId: null,
        AllowApprove: false,
      });
    } else {
      if (!isEmpty(userAccount) && !userSubAgtWithAgtId) {
        formMethod.reset({
          Id: id,
          Photo: userAccount?.Photo,
          Email: userAccount?.Email,
          FullName: userAccount?.FullName,
          Phone: userAccount?.Phone,
          Username: userAccount?.Username,
          AllowBook: userAccount?.AllowBook,
          AllowIssue: userAccount?.AllowIssue,
          AllowSearch: userAccount?.AllowSearch,
          AllowVoid: userAccount?.AllowVoid,
          UserGroupId: userAccount?.UserGroupId,
          Status: userAccount?.Status,
          Remark: userAccount?.Remark,
          SISetId: userAccount?.SISetId,
          AllowApprove: userAccount?.AllowApprove,
        });
      } else if (!isEmpty(userSubAgent) && userSubAgtWithAgtId) {
        formMethod.reset({
          Id: id,
          AgentId: userSubAgent.AgentId,
          Photo: userSubAgent?.Photo,
          Email: userSubAgent?.Email,
          FullName: userSubAgent?.FullName,
          Phone: userSubAgent?.Phone,
          Username: userSubAgent?.Username,
          AllowBook: userSubAgent?.AllowBook,
          AllowIssue: userSubAgent?.AllowIssue,
          AllowSearch: userSubAgent?.AllowSearch,
          AllowVoid: userSubAgent?.AllowVoid,
          UserGroupId: userSubAgent?.UserGroupId,
          Status: userSubAgent?.Status,
          Remark: userSubAgent?.Remark,
          SISetId: userSubAgent?.SISetId,
          AllowApprove: userSubAgent?.AllowApprove,
        });
      }
    }
  }, [formMethod, id, userSubAgtWithAgtId, userAccount, userSubAgent]);

  const addSubAgtAccOrUserAcc = useCallback(() => {
    formMethod.handleSubmit(form => {
      if (userSubAgtWithAgtId) {
        dispatch(
          userSubAgentActions.insertUserSubAgt(
            { ...form, AgentId: userSubAgtWithAgtId },
            data =>
              showModalConfirm({
                lottie: 'done',
                lottieStyle: {
                  width: scale(182),
                  height: scale(72),
                },
                t18nTitle: 'agent_detail:add_user_sub_agt_success',
                renderBody: () => (
                  <Block alignSelf="center" rowGap={16}>
                    <Text
                      textAlign="center"
                      fontStyle="Body14Reg"
                      colorTheme="neutral800">
                      {translate('agent:accounts') + ':'}
                      <Text
                        text={data.Username as string}
                        fontStyle="Body14Semi"
                        colorTheme="neutral900"
                      />
                    </Text>
                    <Text fontStyle="Body14Reg" colorTheme="neutral800">
                      {translate('common:password') + ':'}
                      <Text
                        text={data.Password!}
                        fontStyle="Body14Semi"
                        colorTheme="neutral800"
                      />
                    </Text>
                  </Block>
                ),
                t18nCancel: 'modal_confirm:copy',
                themeColorCancel: 'success500',
                themeColorTextCancel: 'classicWhite',
                onCancel: () => {
                  Clipboard.setString(
                    `${translate('agent:accounts')}: ${
                      data.Username
                    }\n${translate('common:password')}: ${data?.Password}`,
                  );
                  showToast({
                    type: 'success',
                    t18n: 'modal_confirm:copy_success',
                  });
                  goBack();
                },
              }),
          ),
        );
      } else {
        dispatch(
          userAccountActions.addNewUserAccount(form, () => {
            goBack();
          }),
        );
      }
    })();
  }, [formMethod, userSubAgtWithAgtId]);

  const _getTitleName = useMemo(() => {
    if (id === undefined) {
      return 'add_new_user_acc:add_new_user_acc';
    } else {
      if (!isDifferentWithCurrentUserAccountAndNew) {
        return 'personal_info:personal_info';
      } else if (isDifferentWithCurrentUserAccountAndNew) {
        return !userSubAgtWithAgtId
          ? (userAccount?.Username as I18nKeys)
          : (userSubAgent?.Username as I18nKeys);
      }
    }
  }, [
    id,
    isDifferentWithCurrentUserAccountAndNew,
    userAccount?.Username,
    userSubAgent?.Username,
    userSubAgtWithAgtId,
  ]);

  const openHistory = useCallback(() => {
    bottomSheetRef.current?.present({
      ObjectId: userAccount?.Id,
      ObjectType: ObjectHistoryTypes.USER_ACCOUNT,
    });
  }, [userAccount]);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header
          id={id}
          titleName={_getTitleName}
          userSubAgtWithAgtId={userSubAgtWithAgtId}
          openHistory={openHistory}
        />
        <Block flex={1} colorTheme="neutral50">
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <Avatar id={id!} />
            <MainContent id={id} userSubAgtWithAgtId={userSubAgtWithAgtId} />
          </ScrollView>
        </Block>
        {id === undefined && (
          <Block style={styles.containerBottom}>
            <Pressable
              style={{ marginHorizontal: 12 }}
              onPress={addSubAgtAccOrUserAcc}>
              <Block
                borderRadius={8}
                paddingVertical={16}
                alignItems="center"
                justifyContent="center"
                colorTheme="primary600">
                <Text
                  t18n="common:save"
                  fontStyle="Title16Bold"
                  colorTheme="white"
                />
              </Block>
            </Pressable>
          </Block>
        )}
      </FormProvider>
      <BottomSheetHistory ref={bottomSheetRef} />
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors, shadows }) => ({
  container: {
    backgroundColor: colors.neutral100,
  },
  contentContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom + 12,
  },
  containerBottom: {
    backgroundColor: colors.neutral10,
    paddingTop: scale(12),
    paddingHorizontal: scale(12),
    paddingBottom: UnistylesRuntime.insets.bottom + scale(8),
    ...shadows.main,
  },
}));
