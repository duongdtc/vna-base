import { images } from '@assets/image';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectUserGroupById } from '@redux-selector';
import { UserGroup } from '@redux/type';
import { UserAccount } from '@services/axios/axios-data';
import { APP_SCREEN } from '@utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';

export type Props = {
  item: UserAccount;
};

export const UserAccountItem = memo((props: Props) => {
  const { item } = props;

  const userGroup = selectUserGroupById(item.UserGroupId) as UserGroup;

  const navToDetail = () => {
    navigate(APP_SCREEN.PERSONAL_INFO, { id: item.Id! });
  };

  return (
    <Pressable onPress={navToDetail}>
      <Block
        paddingVertical={12}
        paddingHorizontal={16}
        colorTheme="neutral100">
        <Block flexDirection="row" columnGap={12}>
          {/* //cmt: logo agent */}
          <Block
            flex={1}
            maxWidth={34}
            maxHeight={34}
            borderWidth={10}
            borderColorTheme="neutral200"
            opacity={item.Visible ? 1 : 0.6}
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

          {/* //cmt: info agent */}
          <Block flex={1} rowGap={4}>
            <Block
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Text
                text={item.FullName ?? 'N/A'}
                fontStyle="Title16Semi"
                colorTheme={item.Visible ? 'neutral900' : 'neutral600'}
              />
              {!item.Visible && (
                <Block
                  paddingVertical={6}
                  paddingHorizontal={8}
                  colorTheme="neutral50"
                  borderRadius={4}>
                  <Text
                    t18n="order:deleted"
                    colorTheme="neutral600"
                    fontStyle="Capture11Reg"
                  />
                </Block>
              )}
            </Block>
            <Text
              fontStyle="Title16Bold"
              colorTheme={item.Visible ? 'neutral800' : 'neutral600'}>
              {`${item.Username} - `}
              <Text
                text={item.Email ?? 'N/A'}
                fontStyle="Body16Reg"
                colorTheme={item.Visible ? 'neutral800' : 'neutral600'}
              />
            </Text>
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                text={userGroup?.Name as string}
                fontStyle="Body12Bold"
                colorTheme="neutral600"
              />
              {item.LastLoginDate && (
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Block
                    width={4}
                    height={4}
                    borderRadius={2}
                    colorTheme="neutral600"
                  />
                  <Text
                    text={dayjs(item.LastLoginDate).format('DD/MM/YYYY HH:mm')}
                    fontStyle="Body12Reg"
                    colorTheme="neutral600"
                  />
                </Block>
              )}
            </Block>
          </Block>
        </Block>
      </Block>
    </Pressable>
  );
}, isEqual);
