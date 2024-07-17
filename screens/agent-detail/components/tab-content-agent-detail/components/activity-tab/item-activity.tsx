import { images } from '@assets/image';
import { Block, Button, Image, Text, showModalConfirm } from '@vna-base/components';
import { activityActions } from '@vna-base/redux/action-slice';
import { Activity } from '@services/axios/axios-data';
import { translate } from '@vna-base/translations/translate';
import { dispatch } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';

type Props = {
  item: Activity;
};

export const ItemActivity = (props: Props) => {
  const { item } = props;

  const deleteActivity = useCallback(() => {
    showModalConfirm({
      t18nTitle: 'agent_detail:delete_activity',
      renderBody: () => (
        <Text fontStyle="Body14Reg" colorTheme="neutral800" textAlign="center">
          {translate('common:delete') + ': '}
          <Text
            text={item.Content! as string}
            fontStyle="Body14Semi"
            colorTheme="neutral900"
          />
        </Text>
      ),
      t18nCancel: 'common:cancel',
      themeColorCancel: 'neutral50',
      themeColorTextCancel: 'neutral900',
      t18nOk: 'common:delete',
      themeColorOK: 'error500',
      themeColorTextOK: 'classicWhite',
      onOk: () => {
        dispatch(
          activityActions.deleteActivity(item.Id!, item?.AgentId as string),
        );
      },
      flexDirection: 'row',
    });
  }, [item?.AgentId, item.Content, item.Id]);

  return (
    <Block paddingVertical={12} paddingLeft={16} paddingRight={12}>
      <Block flexDirection="row" justifyContent="space-between">
        <Block flexDirection="row" columnGap={12}>
          <Block width={32} height={32} borderRadius={16} overflow="hidden">
            <Image
              source={item.Employee?.Photo ?? images.default_avatar}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
          </Block>
          <Block rowGap={4}>
            <Text
              text={item.Employee?.FullName as string}
              fontStyle="Title16Semi"
              colorTheme="neutral900"
            />
            <Text
              text={dayjs(item.CreatedDate).format('HH:mm DD/MM')}
              fontStyle="Body12Reg"
              colorTheme="neutral600"
            />
            {item.Title && (
              <Text
                text={item.Title}
                fontStyle="Body14Semi"
                colorTheme="neutral800"
              />
            )}
            {item.Content && (
              <Text
                text={item.Content}
                fontStyle="Body12Reg"
                colorTheme="neutral600"
              />
            )}
          </Block>
        </Block>
        <Button
          type="common"
          size="small"
          leftIcon="trash_2_outline"
          textColorTheme="error500"
          leftIconSize={20}
          padding={4}
          onPress={deleteActivity}
        />
      </Block>
    </Block>
  );
};
