import { RowOfForm, Separator } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectAllAgent } from '@redux-selector';
import { FilterFormInBottomSheet } from '@vna-base/screens/payment-history/type';
import { SnapPoint, SystemDetails, TicketTypePaymentDetails } from '@vna-base/utils';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

export const ContentFilter = ({
  formMethod,
}: {
  formMethod: UseFormReturn<FilterFormInBottomSheet, any>;
}) => {
  const styles = useStyles();

  const allAgents = useSelector(selectAllAgent);

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      style={styles.bottomSheetContainer}
      contentContainerStyle={styles.bottomSheetContentContainer}>
      <Separator type="horizontal" size={3} />
      {/* nội dung thanh toán */}
      <RowOfForm<FilterFormInBottomSheet>
        t18n="payment_history:payment_title"
        t18nAll="common:all"
        name="Filter.Title"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* hãng hàng không */}
      <RowOfForm<FilterFormInBottomSheet>
        t18n="payment_history:airline"
        name="Filter.Airline"
        t18nAll="common:all"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* Đại lý */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={allAgents}
        t18n="payment_history:agent"
        t18nBottomSheet="payment_history:agent"
        name="Filter.PaidAgent"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* Hệ thống */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={SystemDetails}
        t18n="payment_history:system"
        t18nBottomSheet="payment_history:system"
        name="Filter.System"
        snapPoint={[SnapPoint.Half]}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* Loại thanh toán */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={TicketTypePaymentDetails}
        t18n="payment_history:payment_type"
        t18nBottomSheet="payment_history:payment_type"
        snapPoint={[SnapPoint['40%']]}
        name="Filter.TicketType"
        control={formMethod.control}
      />
    </BottomSheetScrollView>
  );
};
