import { RowOfForm, Separator } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FilterFormInBottomSheet } from '@vna-base/screens/booking/type';
import { SnapPoint, SystemDetails, TypeOfTripDetails } from '@vna-base/utils';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useStyles } from './styles';

export function ContentFilter({
  formMethod,
  closeBottomSheet,
}: {
  formMethod: UseFormReturn<FilterFormInBottomSheet, any>;
  closeBottomSheet: () => void;
}) {
  const styles = useStyles();

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.bottomSheetContentContainer}>
      <RowOfForm<FilterFormInBottomSheet>
        type="switch"
        t18n="order:show_deleted"
        name="GetAll"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />
      {/* status */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={BookingStatusDetails}
        t18n="booking:status"
        name="Filter.BookingStatus"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* loại hành trình */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={TypeOfTripDetails}
        t18n="booking:journey_type"
        name="Filter.FlightType"
        snapPoint={[SnapPoint['30%']]}
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />
      {/* hãng */}
      <RowOfForm<FilterFormInBottomSheet>
        t18n="booking:airline"
        name="Filter.Airline"
        maxLength={20}
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
        autoCapitalize="characters"
        useBottomSheetInput={true}
      />
      <Separator type="horizontal" size={3} />
      {/* mã đặt chỗ */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.BookingCode"
        autoCapitalize={'characters'}
        t18n="booking:booking_code"
        maxLength={20}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* Đơn hàng */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.OrderCode"
        autoCapitalize={'characters'}
        t18n="booking:order_code"
        maxLength={20}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* Hệ thống */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={SystemDetails}
        t18n="booking:system"
        name="Filter.System"
        hideBottomSheet={closeBottomSheet}
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />
      {/* hành trình  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.Itinerary"
        t18n="booking:procedure"
        maxLength={50}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* Điểm đi  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.StartPoint"
        autoCapitalize={'characters'}
        t18n="booking:departure_point"
        maxLength={50}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* Điểm đến  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.EndPoint"
        autoCapitalize={'characters'}
        t18n="booking:destination"
        maxLength={50}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* Hành khách */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.PaxName"
        t18n="booking:passengers"
        maxLength={80}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* Số lượng hành khách */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.PaxSumm"
        keyboardType="number-pad"
        t18n="booking:passenger_quantity"
        maxLength={2}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* Giá nhập  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.NetPrice"
        keyboardType="number-pad"
        t18n="booking:cost_price"
        maxLength={8}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* giá bán  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.TotalPrice"
        keyboardType="number-pad"
        t18n="booking:selling_price"
        maxLength={8}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* lợi nhuận  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.Profit"
        keyboardType="number-pad"
        t18n="booking:profit"
        maxLength={8}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* tiền tệ  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.Currency"
        t18n="booking:currency"
        maxLength={20}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* hạng chỗ  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.FareClass"
        t18n="booking:seat_class"
        maxLength={20}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* fare basic  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.FareBasis"
        t18n="booking:fare_basis"
        maxLength={20}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* số điện thoại  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.ContactPhone"
        keyboardType="number-pad"
        t18n="booking:phone_number"
        maxLength={16}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* email  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.ContactEmail"
        t18n="booking:email"
        maxLength={120}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* Khách hàng  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.SubAgName"
        t18n="booking:customer"
        maxLength={80}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* đại lý đặt  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.AgentName"
        t18n="booking:booking_agency"
        maxLength={80}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* người đặt  */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.CreatedUser"
        t18n="booking:booker"
        useBottomSheetInput={true}
        maxLength={80}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />

      {/* tốc độ phản hồi  */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.ResponseTime"
        keyboardType="number-pad"
        t18n="booking:response_speed"
        maxLength={4}
        useBottomSheetInput={true}
        hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}

      {/* ghi chú  */}

      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        name="Filter.ErrorMessage"
        t18n="booking:note"
        maxLength={200}
        hideBottomSheet={closeBottomSheet}
      /> */}
    </BottomSheetScrollView>
  );
}
