import { RowOfForm, Separator } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FilterFormInBottomSheet } from '@vna-base/screens/order/type';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useStyles } from './styles';

export const ContentFilter = ({
  formMethod,
}: // closeBottomSheet,
{
  formMethod: UseFormReturn<FilterFormInBottomSheet, any>;
  closeBottomSheet: () => void;
}) => {
  const styles = useStyles();

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      style={styles.bottomSheetContainer}
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

      {/* Mã đơn hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        keyboardType="number-pad"
        t18n="order:order_code"
        maxLength={30}
        name="Filter.Index"
        useBottomSheetInput={true}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* Trạng thái đơn hàng */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={OrderStatusDetails}
        t18n="order:status"
        name="Filter.OrderStatus"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* Mã đặt chỗ */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:booking_code"
        maxLength={10}
        name="Filter.FlightBooking"
        useBottomSheetInput={true}
        autoCapitalize={'characters'}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* Chuyến bay */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:flight"
        name="Filter.FlightInfo"
        maxLength={30}
        autoCapitalize={'characters'}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* Hệ thống  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={SystemDetails}
        t18n="order:system"
        name="Filter.FlightSystem"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} /> */}

      {/* Tên khách  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:passenger_name"
        maxLength={80}
        name="Filter.PaxName"
        useBottomSheetInput={true}
        autoCapitalize={'characters'}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* Số khách  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:number_of_passengers"
        maxLength={2}
        name="Filter.PaxSumm"
        keyboardType="number-pad"
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}

      {/* Giá nhập */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:purchase_price"
        maxLength={8}
        name="Filter.NetPrice"
        keyboardType="number-pad"
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}

      {/* Giá bán */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:selling_price"
        maxLength={8}
        name="Filter.TotalPrice"
        keyboardType="number-pad"
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* Lợi nhuận  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:profit"
        maxLength={8}
        name="Filter.Profit"
        keyboardType="number-pad"
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* Đã Thanh toán  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:paid"
        maxLength={8}
        name="Filter.PaidAmt"
        keyboardType="number-pad"
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* loại tiền  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:currency"
        maxLength={20}
        name="Filter.Currency"
        autoCapitalize={'characters'}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}

      {/* ten Khách hàng  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:customer_name"
        maxLength={80}
        name="Filter.SubAgName"
        autoCapitalize={'characters'}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* Đại lý đặt  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:agent_booking"
        maxLength={80}
        name="Filter.AgentName"
        useBottomSheetInput={true}
        autoCapitalize={'characters'}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* Tên liên hệ  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:contact"
        maxLength={80}
        name="Filter.ContactName"
        autoCapitalize={'characters'}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* số điện thoại liên hệ  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:phone"
        maxLength={16}
        name="Filter.ContactPhone"
        keyboardType="number-pad"
        useBottomSheetInput={true}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* email  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:email"
        maxLength={120}
        name="Filter.ContactEmail"
        autoCapitalize={'characters'}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* Người đặt  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:created_user"
        maxLength={80}
        name="Filter.CreatedUser"
        autoCapitalize={'characters'}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* Người xử lý  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="order:processor"
        maxLength={80}
        name="Filter.MonitorUser"
        useBottomSheetInput={true}
        autoCapitalize={'characters'}
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* Phương thức thanh toán  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={PaymentMethodDetails}
        t18n="order:payment_method"
        name="Filter.PaymentMethod"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} /> */}

      {/* tình trạng thanh toán  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={PaymentStatusDetails}
        t18n="order:payment_status"
        name="Filter.PaymentStatus"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} /> */}
    </BottomSheetScrollView>
  );
};
