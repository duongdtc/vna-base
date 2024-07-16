import { RowOfForm, Separator } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectAllTypeTopup } from '@redux-selector';
import { selectAllBankAccounts } from '@redux/selector/bank';
import { FilterFormInBottomSheet } from '@vna-base/screens/topup-history/type';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';
import { TopupMethodDetails } from '@vna-base/utils';

export const ContentFilter = ({
  formMethod,
}: {
  formMethod: UseFormReturn<FilterFormInBottomSheet, any>;
}) => {
  const styles = useStyles();

  const AllTypes = useSelector(selectAllTypeTopup);
  const Accounts = useSelector(selectAllBankAccounts);

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      style={styles.bottomSheetContainer}
      contentContainerStyle={styles.bottomSheetContentContainer}>
      <Separator type="horizontal" size={3} />
      {/* Loại giao dịch */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={AllTypes}
        t18n="transaction_history:transaction_type"
        t18nBottomSheet="transaction_history:transaction_type"
        name="Filter.EntryType"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* Phương thức */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={TopupMethodDetails}
        t18n="transaction_history:method"
        t18nBottomSheet="transaction_history:method"
        name="Filter.PaymentMethod"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* Tài khoản nhận tiền */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={Accounts}
        t18n="transaction_history:receive_account"
        t18nBottomSheet="transaction_history:receive_account"
        name="Filter.AccountId"
        control={formMethod.control}
      />
    </BottomSheetScrollView>
  );
};
