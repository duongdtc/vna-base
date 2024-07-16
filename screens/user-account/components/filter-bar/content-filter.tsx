import { RowOfForm, Separator } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectAllUserGroups } from '@redux-selector';
import { FilterFormInBottomSheet } from '@vna-base/screens/user-account/type';
import { SnapPoint } from '@vna-base/utils';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';
import { translate } from '@vna-base/translations/translate';
import { statusActive } from '@vna-base/screens/agent/type';

export const ContentFilter = ({
  formMethod,
}: // closeBottomSheet,
{
  formMethod: UseFormReturn<FilterFormInBottomSheet, any>;
  closeBottomSheet: () => void;
}) => {
  const styles = useStyles();

  const UserGroups = useSelector(selectAllUserGroups);

  // const AgentTypes = useSelector(selectAllAgentType);
  // const AgentGroups = useSelector(selectAllAgentGroup);

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.bottomSheetContentContainer}>
      <Separator type="horizontal" size={3} />
      {/* //cmt: Loại khách hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={UserGroups}
        t18n="agent_detail:user_group"
        t18nBottomSheet="agent_detail:user_group"
        name="Filter.UserGroupId"
        // hideBottomSheet={closeBottomSheet}
        snapPoint={[SnapPoint.Half]}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />
      {/* //cmt: Trạng thái khách hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={statusActive}
        t18n="order:status"
        t18nBottomSheet="order:status"
        name="Filter.Status"
        // hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />
      {/* <RowOfForm<FilterFormInBottomSheet>
        type="switch"
        t18n="order:show_deleted"
        name="GetAll"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      /> */}
      {/* <Separator type="horizontal" size={3} /> */}
      {/* //cmt: index khách hàng */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="agent:customer_id"
        name="Filter.Index"
        maxLength={20}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* //cmt: tên tài khoản khách hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="home:account"
        name="Filter.Username"
        maxLength={20}
        placeholder={translate('common:type_to_search')}
        keyboardType="number-pad"
        useBottomSheetInput={true}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* //cmt: tên khách hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="system:full_name"
        name="Filter.FullName"
        maxLength={20}
        placeholder={translate('common:type_to_search')}
        useBottomSheetInput={true}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* //cmt: user group id */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="onboarding_screen:contact"
        name="Filter.UserGroupId"
        maxLength={20}
        hideBottomSheet={closeBottomSheet}
      /> */}
      {/* <Separator type="horizontal" size={3} /> */}
      {/* //cmt: Điện thoại */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="order:phone"
        name="Filter.Phone"
        maxLength={20}
        placeholder={translate('common:type_to_search')}
        useBottomSheetInput={true}
        keyboardType="numeric"
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* //cmt: Email */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="order:email"
        name="Filter.Email"
        maxLength={20}
        placeholder={translate('common:type_to_search')}
        useBottomSheetInput={true}
        keyboardType="email-address"
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* //cmt: Địa chỉ */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="user_account:address"
        name="Filter.Address"
        maxLength={30}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* //cmt: Nhóm khách hàng */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={AgentGroups}
        t18n="agent:group_customer"
        name="Filter.AgentGroup"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />

      <Separator type="horizontal" size={3} /> */}

      <Separator type="horizontal" size={3} />
    </BottomSheetScrollView>
  );
};
