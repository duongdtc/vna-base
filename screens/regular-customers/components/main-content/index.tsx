import { I18nKeys } from '@translations/locales';
import {
  Block,
  DescriptionsBooking,
  RowOfForm,
  Separator,
  Text,
} from '@vna-base/components';
import {
  selectAllUserGroups,
  selectCurrentAccount,
  selectUserAccount,
} from '@vna-base/redux/selector';
import { Gender, GenderTypeDetails, rxEmail, rxPhone } from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { PersonalInfoForm } from '../../type';
import dayjs from 'dayjs';

type Props = {
  id?: string | null;
  userSubAgtWithAgtId?: string;
};

export const MainContent = memo((props: Props) => {
  const { id } = props;

  const { Id } = useSelector(selectCurrentAccount);
  const UserGroups = useSelector(selectAllUserGroups);

  const { control } = useFormContext<PersonalInfoForm>();

  const isDifferentWithCurrentUserAccountAndNew = useMemo(
    () => (id === undefined || id !== Id ? true : false),
    [Id, id],
  );

  return (
    <>
      <Block
        borderRadius={12}
        marginHorizontal={12}
        marginTop={12}
        overflow="hidden"
        colorTheme="neutral100">
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
          type="dropdown"
          name="Gender"
          t18n="Giới tính"
          t18nAll="Chưa chọn"
          removeAll
          typeDetails={GenderTypeDetails}
          isRequire={true}
          fixedTitleFontStyle
        />
        <Separator type="horizontal" size={3} />
        {/* //cmt: nhóm tài khoản */}
        <RowOfForm<PassportUpdateForm>
          t18n="booking:dob"
          name={'Dob'}
          fixedTitleFontStyle={true}
          type="date-picker"
          maximumDate={dayjs().subtract(18, 'years').toDate()}
          minimumDate={dayjs().subtract(80, 'years').toDate()}
          colorThemeValue="neutral700"
          control={control}
          isRequire
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<PersonalInfoForm>
          control={control}
          name="Phone"
          t18n={'Điện thoại' as I18nKeys}
          fixedTitleFontStyle
          pattern={rxPhone}
          maxLength={20}
          isRequire
        />
        <Separator type="horizontal" size={3} />
        <RowOfForm<PersonalInfoForm>
          control={control}
          name="Email"
          t18n={'Email' as I18nKeys}
          fixedTitleFontStyle
          pattern={rxEmail}
          maxLength={120}
          isRequire
        />

        <Separator type="horizontal" size={3} />
        {/* //cmt: ghi chú */}
        <RowOfForm<PersonalInfoForm>
          t18n="tax_info:note"
          name="Remark"
          fixedTitleFontStyle={true}
          control={control}
        />
        <Separator type="horizontal" size={3} />
      </Block>
      {/* <Block margin={16} paddingTop={8}>
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
      </Block> */}
    </>
  );
}, isEqual);
