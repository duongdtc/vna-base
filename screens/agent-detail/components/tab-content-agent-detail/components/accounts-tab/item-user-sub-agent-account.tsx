import { images } from '@assets/image';
import {
  Block,
  Button,
  Icon,
  Image,
  Text,
  showModalConfirm,
} from '@vna-base/components';
import { userSubAgentActions } from '@redux-slice';
import { UserAccount } from '@services/axios/axios-data';
import { translate } from '@vna-base/translations/translate';
import { delay, dispatch, scale } from '@vna-base/utils';
import React, { useCallback } from 'react';

type Props = {
  item: UserAccount;
  onPressItem: () => void;
};

export const ItemUserSubAgentAccount = (props: Props) => {
  const { item, onPressItem } = props;

  const onRestoreItem = useCallback(() => {
    showModalConfirm({
      t18nTitle: 'agent_detail:restore_sub_agt_acc',
      renderBody: () => (
        <Text fontStyle="Body14Reg" colorTheme="neutral800" textAlign="center">
          {translate('agent:accounts') + ': '}
          <Text
            text={item?.Username as string}
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
          userSubAgentActions.restoreUserSubAgt(
            item.Id!,
            item?.AgentId as string,
            async () => {
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
                      text={item?.Username as string}
                      fontStyle="Body14Semi"
                      colorTheme="neutral900"
                    />
                  </Text>
                ),
              });
            },
          ),
        );
      },
      flexDirection: 'row',
    });
  }, [item?.AgentId, item.Id, item?.Username]);

  return (
    <Block paddingVertical={12} paddingLeft={16} paddingRight={12}>
      <Block flexDirection="row" justifyContent="space-between">
        <Block flex={1} flexDirection="row" columnGap={12}>
          <Block
            width={32}
            height={32}
            borderWidth={10}
            opacity={item.Visible ? 1 : 0.2}
            borderColorTheme="neutral200"
            borderRadius={16}>
            <Image
              source={item.Photo ?? images.default_avatar}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                overflow: 'hidden',
              }}
              resizeMode="cover"
            />
            <Block
              borderRadius={10}
              style={{ bottom: -2, right: -2 }}
              colorTheme="neutral100"
              position="absolute"
              alignItems="center"
              justifyContent="center">
              <Icon
                icon={
                  item.Status ? 'checkmark_circle_fill' : 'close_circle_fill'
                }
                size={12}
                colorTheme={item.Status ? 'success500' : 'error500'}
              />
            </Block>
          </Block>
          <Block rowGap={4}>
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                text={item.FullName as string}
                fontStyle="Title16Semi"
                colorTheme={item.Visible ? 'neutral900' : 'neutral600'}
              />
              {!item.Visible && (
                <Block
                  paddingVertical={2}
                  paddingHorizontal={6}
                  alignItems="center"
                  colorTheme="neutral50"
                  justifyContent="center"
                  borderRadius={4}>
                  <Text
                    t18n="order:deleted"
                    fontStyle="Capture11Reg"
                    colorTheme="neutral600"
                  />
                </Block>
              )}
            </Block>
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                text={item.Username as string}
                fontStyle="Body12Med"
                colorTheme={item.Visible ? 'neutral800' : 'neutral600'}
              />
              <Block
                width={4}
                height={4}
                borderRadius={2}
                colorTheme={item.Visible ? 'neutral800' : 'neutral600'}
              />
              <Text
                text={translate('user_account:role') + ':'}
                fontStyle="Body12Reg"
                colorTheme={item.Visible ? 'neutral800' : 'neutral600'}
              />
              <Text
                text={
                  (item.UserGroup?.Code as string) +
                  ' - ' +
                  (item.UserGroup?.Name as string)
                }
                fontStyle="Body12Med"
                colorTheme={item.Visible ? 'neutral800' : 'neutral600'}
              />
            </Block>
          </Block>
        </Block>
        <Block flex={0.3} alignItems="flex-end">
          <Block flexDirection="row" alignItems="center" columnGap={12}>
            {!item.Visible && (
              <Button
                type="common"
                size="small"
                leftIcon="refresh_outline"
                textColorTheme="success500"
                leftIconSize={20}
                padding={2}
                onPress={onRestoreItem}
              />
            )}
            <Button
              type="common"
              size="small"
              leftIcon="more_vertical_outline"
              textColorTheme="neutral900"
              leftIconSize={20}
              padding={4}
              onPress={onPressItem}
            />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
