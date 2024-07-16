import {
  Block,
  DescriptionsBooking,
  RowOfForm,
  Separator,
  Text,
} from '@vna-base/components';
import {
  selectAllSIset,
  selectAllUserGroups,
  selectCurrentAccount,
  selectUserAccount,
} from '@redux-selector';
import { rxEmail, rxPhone } from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import isEqual from 'react-fast-compare';
import { PersonalInfoForm } from '@vna-base/screens/personal-info/type';

type Props = {
  id?: string | null;
  userSubAgtWithAgtId?: string;
};

export const MainContent = memo((props: Props) => {
  const { id, userSubAgtWithAgtId } = props;

  const { Id } = useSelector(selectCurrentAccount);
  const userAccount = useSelector(selectUserAccount(id!));
  const UserGroups = useSelector(selectAllUserGroups);
  const allSISet = useSelector(selectAllSIset);

  const { control } = useFormContext<PersonalInfoForm>();

  const isDifferentWithCurrentUserAccountAndNew = useMemo(
    () => (id === undefined || id !== Id ? true : false),
    [Id, id],
  );

  return (
    <>
      {id && id === userAccount?.Id && !userAccount?.Visible && (
        <Block marginTop={12} marginHorizontal={12}>
          <DescriptionsBooking
            t18n="personal_info:deleted_account"
            colorTheme="error50"
          />
        </Block>
      )}
      <Block
        borderRadius={12}
        marginHorizontal={12}
        marginTop={12}
        overflow="hidden"
        colorTheme="neutral100">
        {/* //cmt: trạng thái kích hoạt */}
        {isDifferentWithCurrentUserAccountAndNew && (
          <>
            <RowOfForm<PersonalInfoForm>
              type="switch"
              t18n="agent:status_active"
              name="Status"
              fixedTitleFontStyle={true}
              control={control}
            />
            <Separator type="horizontal" size={3} />
          </>
        )}
        <RowOfForm<PersonalInfoForm>
          control={control}
          name="FullName"
          t18n="input_info_passenger:full_name"
          disable={!isDifferentWithCurrentUserAccountAndNew}
          isRequire={isDifferentWithCurrentUserAccountAndNew}
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<PersonalInfoForm>
          control={control}
          name="Username"
          t18n="common:username"
          disable={!isDifferentWithCurrentUserAccountAndNew}
          isRequire={isDifferentWithCurrentUserAccountAndNew}
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        {/* //cmt: nhóm tài khoản */}
        <RowOfForm<PersonalInfoForm>
          type="dropdown"
          t18n="agent_detail:user_group"
          t18nBottomSheet="agent_detail:user_group"
          name="UserGroupId"
          fixedTitleFontStyle={true}
          control={control}
          isRequire={isDifferentWithCurrentUserAccountAndNew}
          disable={!isDifferentWithCurrentUserAccountAndNew}
          typeDetails={UserGroups}
          removeAll
          t18nAll="common:not_choose"
          // eslint-disable-next-line react/no-unstable-nested-components
          ValueView={item => {
            return (
              <Text
                text={
                  `${UserGroups[item].Code}- ${UserGroups[item].Name}` ??
                  `${userAccount?.UserGroup?.Code} - ${userAccount?.UserGroup?.Name}`
                }
                fontStyle="Body14Bold"
                colorTheme="neutral900"
              />
            );
          }}
          colorThemeValue="neutral700"
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<PersonalInfoForm>
          control={control}
          name="Phone"
          t18n="user_account:phone_number"
          fixedTitleFontStyle
          pattern={rxPhone}
          isRequire
          maxLength={20}
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<PersonalInfoForm>
          control={control}
          name="Email"
          t18n="user_account:email"
          fixedTitleFontStyle
          pattern={rxEmail}
          isRequire
          maxLength={120}
        />
        {isDifferentWithCurrentUserAccountAndNew && (
          <>
            <Separator type="horizontal" size={3} />
            {/* //cmt: ghi chú */}
            <RowOfForm<PersonalInfoForm>
              t18n="tax_info:note"
              name="Remark"
              fixedTitleFontStyle={true}
              control={control}
            />
            <Separator type="horizontal" size={3} />
            {/* //cmt: tài khoản đặt vé */}
            {!userSubAgtWithAgtId && (
              <RowOfForm<PersonalInfoForm>
                type="dropdown"
                t18n="agent:account_booking_ticket"
                t18nBottomSheet="agent:account_booking_ticket"
                name="SISetId"
                fixedTitleFontStyle={true}
                control={control}
                isRequire
                typeDetails={allSISet}
                colorThemeValue="neutral700"
                removeAll
                t18nAll="common:not_choose"
              />
            )}
          </>
        )}
      </Block>
      <Block margin={16} paddingTop={8}>
        <Text
          t18n="personal_info:right_to_use"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
      </Block>
      <Block
        colorTheme="neutral100"
        marginHorizontal={16}
        borderRadius={12}
        overflow="hidden">
        <RowOfForm<PersonalInfoForm>
          type="switch"
          control={control}
          name="AllowSearch"
          t18n="common:search"
          disable={!isDifferentWithCurrentUserAccountAndNew}
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<PersonalInfoForm>
          type="switch"
          control={control}
          name="AllowBook"
          t18n="common:book"
          disable={!isDifferentWithCurrentUserAccountAndNew}
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<PersonalInfoForm>
          type="switch"
          control={control}
          name="AllowIssue"
          t18n="common:issue"
          disable={!isDifferentWithCurrentUserAccountAndNew}
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<PersonalInfoForm>
          type="switch"
          control={control}
          name="AllowVoid"
          t18n="common:void_ticket"
          disable={!isDifferentWithCurrentUserAccountAndNew}
          fixedTitleFontStyle
        />
        {isDifferentWithCurrentUserAccountAndNew && (
          <>
            <Separator type="horizontal" size={3} />
            <RowOfForm<PersonalInfoForm>
              type="switch"
              control={control}
              name="AllowApprove"
              t18n="add_new_user_acc:approve_documents"
              fixedTitleFontStyle
            />
          </>
        )}
      </Block>
    </>
  );
}, isEqual);
