import { RowOfForm, Separator } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectAllAgentGroup, selectAllAgentType } from '@redux-selector';
import { FilterFormInBottomSheet, statusActive } from '@vna-base/screens/agent/type';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

export const ContentFilter = ({
  formMethod,
}: // closeBottomSheet,
{
  formMethod: UseFormReturn<FilterFormInBottomSheet, any>;
  closeBottomSheet: () => void;
}) => {
  const styles = useStyles();

  const AgentTypes = useSelector(selectAllAgentType);
  const AgentGroups = useSelector(selectAllAgentGroup);

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.bottomSheetContentContainer}>
      <Separator type="horizontal" size={3} />
      {/* <RowOfForm<FilterFormInBottomSheet>
        type="switch"
        t18n="order:show_deleted"
        name="GetAll"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* //cmt: Nhóm khách hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={AgentGroups}
        t18n="agent:group_customer"
        t18nBottomSheet="agent:group_customer"
        name="Filter.AgentGroup"
        // hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />

      <Separator type="horizontal" size={3} />
      {/* //cmt: Loại khách hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={AgentTypes}
        t18n="agent:type_customer"
        t18nBottomSheet="agent:type_customer"
        name="Filter.AgentType"
        // hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />
      {/* //cmt: Trạng thái */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={statusActive}
        t18n="order:status"
        t18nBottomSheet="order:status"
        name="Filter.Active"
        // hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* //cmt: mã khách hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="agent:customer_id"
        name="Filter.CustomerID"
        maxLength={20}
        useBottomSheetInput={true}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* //cmt: mã hệ thống */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="add_new_agent:agent_code"
        name="Filter.AgentCode"
        maxLength={20}
        useBottomSheetInput={true}
        keyboardType="number-pad"
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* //cmt: tên khách hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="agent:customer_name"
        name="Filter.AgentName"
        maxLength={20}
        useBottomSheetInput={true}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* //cmt: Liên hệ */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="onboarding_screen:contact"
        name="Filter.Contact"
        maxLength={20}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* //cmt: Điện thoại */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize={'characters'}
        t18n="order:phone"
        name="Filter.Phone"
        maxLength={20}
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
      /> */}
    </BottomSheetScrollView>
  );
};
