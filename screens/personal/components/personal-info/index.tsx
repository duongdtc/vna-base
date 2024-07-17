import { Block, Row, Separator, Text } from '@vna-base/components';
import { selectCurrentAccount, selectUserGroupById } from '@vna-base/redux/selector';
import { useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { isIos, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';

export const PersonalInfo = memo(() => {
  const userAccount = useSelector(selectCurrentAccount);
  const userGroup = selectUserGroupById(userAccount.UserGroupId);
  const { colors } = useTheme();

  return (
    <Block rowGap={16} paddingTop={8}>
      <Text
        t18n="system:profile"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block borderRadius={12} overflow="hidden" colorTheme="neutral100">
        <Row
          t18n="input_info_passenger:full_name"
          disable
          fixedTitleFontStyle
          value={userAccount?.FullName as string}
          styleInput={
            isIos
              ? {}
              : {
                  paddingVertical: 0,
                  height: scale(18),
                }
          }
        />
        <Separator type="horizontal" size={3} />
        <Row
          t18n="common:username"
          disable
          fixedTitleFontStyle
          value={userAccount?.Username as string}
          styleInput={
            isIos
              ? {}
              : {
                  paddingVertical: 0,
                  height: scale(18),
                }
          }
        />
        <Separator type="horizontal" size={3} />

        {!isEmpty(userGroup) && (
          <Row
            t18n="agent_detail:user_group"
            disable
            fixedTitleFontStyle
            value={`${userGroup.Code} - ${userGroup.Name}`}
            styleInput={[
              {
                ...FontStyle.Body14Bold,
                color: colors.neutral900,
              },
              !isIos && {
                paddingVertical: 0,
                height: scale(19),
              },
            ]}
          />
        )}
        <Separator type="horizontal" size={3} />
        <Row
          t18n="user_account:phone_number"
          disable
          fixedTitleFontStyle
          value={userAccount?.Phone as string}
          styleInput={
            isIos
              ? {}
              : {
                  paddingVertical: 0,
                  height: scale(18),
                }
          }
        />
        <Separator type="horizontal" size={3} />
        <Row
          t18n="user_account:email"
          disable
          fixedTitleFontStyle
          value={userAccount?.Email as string}
          styleInput={
            isIos
              ? {}
              : {
                  paddingVertical: 0,
                  height: scale(18),
                }
          }
        />
        <Separator type="horizontal" size={3} />
      </Block>
    </Block>
  );
}, isEqual);
