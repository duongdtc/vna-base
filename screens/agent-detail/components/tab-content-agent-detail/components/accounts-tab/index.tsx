/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ActionSheet,
  Block,
  Icon,
  Text,
  showModalConfirm,
  showToast,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { navigate } from '@navigation/navigation-service';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  selectAgentDetailById,
  selectListUserSubAgentAccount,
} from '@vna-base/redux/selector';
import { userSubAgentActions } from '@vna-base/redux/action-slice';
import { listOptionItemSubAgtAcc } from '@vna-base/screens/agent-detail/type';
import { UserAccount } from '@services/axios/axios-data';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { delay, dispatch, scale } from '@vna-base/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ItemUserSubAgentAccount } from './item-user-sub-agent-account';
import { APP_SCREEN } from '@utils';

export const AccountsTab = () => {
  const { colors } = useTheme();
  const { Id } = useSelector(selectAgentDetailById);
  const ListSubAgentAccount = useSelector(selectListUserSubAgentAccount);

  const actionSheetRef = useRef<ActionSheet>(null);
  const itemRef = useRef<UserAccount>();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [optionActionSheet, setOptionActionSheet] =
    useState<Array<OptionData>>();

  useEffect(() => {
    dispatch(userSubAgentActions.getListUserSubAgent(Id!));
  }, [Id]);

  const _onShowOption = useCallback((userSubAgt: UserAccount) => {
    itemRef.current = userSubAgt;
    if (!itemRef.current?.Visible) {
      setOptionActionSheet(
        listOptionItemSubAgtAcc.slice(0, listOptionItemSubAgtAcc.length - 1),
      );
    } else {
      setOptionActionSheet(listOptionItemSubAgtAcc);
    }

    actionSheetRef.current?.show();
  }, []);

  const _resetPassword = useCallback(() => {
    showModalConfirm({
      t18nTitle: 'agent_detail:title_recreated_acc',
      renderBody: () => (
        <Text fontStyle="Body14Reg" colorTheme="neutral800" textAlign="center">
          {translate('agent:accounts') + ': '}
          <Text
            text={itemRef.current?.Username as string}
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
            itemRef.current?.Id as string,
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
  }, []);

  const _delete = useCallback(() => {
    showModalConfirm({
      t18nTitle: 'agent_detail:delete_sub_agt_acc',
      renderBody: () => (
        <Text fontStyle="Body14Reg" colorTheme="neutral800" textAlign="center">
          {translate('agent:accounts') + ': '}
          <Text
            text={itemRef.current?.Username as string}
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
          userSubAgentActions.deleteUserSubAgt(
            itemRef.current?.Id as string,
            itemRef.current?.AgentId as string,
          ),
        );
      },
    });
  }, []);

  const onPressOption = (item: OptionData) => {
    if (item.key === 'EDIT_INFO') {
      navigate(APP_SCREEN.PERSONAL_INFO, {
        id: itemRef.current!.Id!,
        userSubAgtWithAgtId: itemRef.current!.AgentId!,
      });
    }

    if (item.key === 'RESET_PASS') {
      _resetPassword();
    }

    if (item.key === 'DELETE') {
      _delete();
    }
  };

  const _renderItem = useCallback<ListRenderItem<UserAccount>>(
    ({ item }) => {
      return (
        <ItemUserSubAgentAccount
          item={item}
          onPressItem={() => _onShowOption(item)}
        />
      );
    },
    [_onShowOption],
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(
      userSubAgentActions.getListUserSubAgent(Id!, () => {
        setIsRefreshing(false);
      }),
    );
  }, [Id]);

  const navToUserSubAgt = () => {
    navigate(APP_SCREEN.PERSONAL_INFO, {
      id: undefined,
      userSubAgtWithAgtId: Id!,
    });
  };

  return (
    <Block flex={1} colorTheme="neutral50">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.neutral900}
          />
        }
        contentContainerStyle={{
          padding: 12,
        }}>
        <Pressable onPress={navToUserSubAgt} style={{ marginBottom: 12 }}>
          <Block
            flexDirection="row"
            alignItems="center"
            colorTheme="neutral100"
            paddingVertical={16}
            shadow=".3"
            borderRadius={8}
            columnGap={8}
            justifyContent="center">
            <Icon icon="plus_fill" size={18} colorTheme="primary900" />
            <Text
              t18n="agent:add_account"
              colorTheme="primary900"
              fontStyle="Body14Semi"
            />
          </Block>
        </Pressable>
        <Block flex={1} colorTheme="neutral100" borderRadius={12}>
          <FlatList
            data={ListSubAgentAccount}
            keyExtractor={(item, index) => `${item.Id}_${index}`}
            renderItem={_renderItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <Block height={1} colorTheme="neutral50" />
            )}
          />
        </Block>
      </ScrollView>
      <ActionSheet
        type="select"
        typeBackDrop="gray"
        ref={actionSheetRef}
        onPressOption={onPressOption}
        option={optionActionSheet}
      />
    </Block>
  );
};
