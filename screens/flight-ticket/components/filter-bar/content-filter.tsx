import { RowOfForm, Separator, Text } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FilterFormInBottomSheet } from '@vna-base/screens/flight-ticket/type';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useStyles } from './styles';
import { useSelector } from 'react-redux';
import { selectAllAccounts } from '@redux-selector';
import { UserAccount } from '@services/axios/axios-data';

export const ContentFilter = ({
  formMethod,
}: // closeBottomSheet,
{
  formMethod: UseFormReturn<FilterFormInBottomSheet, any>;
  closeBottomSheet: () => void;
}) => {
  const styles = useStyles();

  const allAccounts = useSelector(selectAllAccounts);

  const convertIssueUser = (val: UserAccount) => {
    const user = Object.values(allAccounts).find(item => item.Id === val);
    return (
      <Text
        fontStyle="Body14Reg"
        colorTheme="neutral700"
        text={user?.FullName as string}
      />
    );
  };

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      style={styles.bottomSheetContainer}
      contentContainerStyle={styles.bottomSheetContentContainer}>
      <Separator type="horizontal" size={3} />
      {/* Số vé */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize="characters"
        keyboardType="number-pad"
        t18n="flight_ticket:ticket_number"
        maxLength={30}
        useBottomSheetInput={true}
        name="Filter.TicketNumber"
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* Mã đặt chỗ */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize="characters"
        t18n="flight_ticket:booking_code"
        maxLength={30}
        useBottomSheetInput={true}
        name="Filter.BookingCode"
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* Tên hành khách */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize="characters"
        t18n="flight_ticket:passenger_name"
        maxLength={80}
        useBottomSheetInput={true}
        name="Filter.FullName"
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} />
      {/* Đại lý đặt */}
      {/* <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        autoCapitalize="characters"
        t18n="flight_ticket:agent_booking"
        maxLength={80}
        useBottomSheetInput={true}
        name="Filter.AgentId"
        // hideBottomSheet={closeBottomSheet}
      />
      <Separator type="horizontal" size={3} /> */}
      {/* Người xuất vé */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={allAccounts}
        control={formMethod.control}
        t18n="flight_ticket:issue_user"
        t18nBottomSheet="flight_ticket:issue_user"
        name="Filter.IssueUser"
        ValueView={convertIssueUser}
      />
      <Separator type="horizontal" size={3} />
    </BottomSheetScrollView>
  );
};
