import { images } from '@assets/image';
import {
  Block,
  Button,
  Icon,
  Image,
  Text,
  showModalConfirm,
} from '@vna-base/components';
import { contactActions } from '@redux-slice';
import { Contact } from '@services/axios/axios-data';
import { translate } from '@vna-base/translations/translate';
import { dispatch } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';

type Props = {
  item: Contact;
};

export const ItemContact = (props: Props) => {
  const { item } = props;

  const deleteContact = useCallback(() => {
    showModalConfirm({
      t18nTitle: 'agent_detail:delete_emp',
      renderBody: () => (
        <Text fontStyle="Body14Reg" colorTheme="neutral800" textAlign="center">
          {translate('agent:employees') + ': '}
          <Text
            text={item?.FullName as string}
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
      flexDirection: 'row',
      onOk: () => {
        dispatch(contactActions.deleteContact(item.Id!, item.AgentId!));
      },
    });
  }, [item]);

  return (
    <Block paddingVertical={12} paddingLeft={16} paddingRight={12}>
      <Block flexDirection="row" justifyContent="space-between">
        <Block flexDirection="row" columnGap={12}>
          <Block width={32} height={32} borderRadius={16} overflow="hidden">
            <Image
              source={item.Photo ?? images.default_avatar}
              style={{ width: 32, height: 32 }}
              resizeMode="cover"
            />
          </Block>
          <Block rowGap={2}>
            <Text
              text={item.FullName as string}
              fontStyle="Title16Semi"
              colorTheme="neutral900"
            />
            <Text
              text={item.Email as string}
              fontStyle="Body12Reg"
              colorTheme="neutral600"
            />
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                text={item.Title as string}
                fontStyle="Body12Med"
                colorTheme="neutral800"
              />
              <Icon icon="phone_fill" size={10} colorTheme="neutral800" />
              <Text
                text={item.Phone as string}
                fontStyle="Capture11Reg"
                colorTheme="neutral800"
              />
              <Icon icon="calendar_fill" size={10} colorTheme="neutral800" />
              <Text
                text={dayjs(item.DateOfBirth).format('DD/MM/YYYY')}
                fontStyle="Capture11Reg"
                colorTheme="neutral800"
              />
            </Block>
          </Block>
        </Block>
        <Button
          type="common"
          size="small"
          leftIcon="trash_2_outline"
          textColorTheme="error500"
          leftIconSize={20}
          padding={4}
          onPress={deleteContact}
        />
      </Block>
    </Block>
  );
};
