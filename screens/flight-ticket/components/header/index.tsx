import { Button, NormalHeader, Text, showToast } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { flightTicketActions } from '@vna-base/redux/action-slice';
import { FilterForm } from '@vna-base/screens/flight-ticket/type';
import { HitSlop, dispatch, getState } from '@vna-base/utils';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export const Header = () => {
  const { getValues } = useFormContext<FilterForm>();

  const exportExcel = () => {
    const { list } = getState('flightTicket').resultFilter;
    if (list && list.length > 0) {
      dispatch(flightTicketActions.exportExcel(getValues()));
    } else {
      showToast({
        type: 'error',
        t18n: 'flight_ticket:no_flight_ticket',
      });
    }
  };

  return (
    <NormalHeader
      colorTheme="neutral100"
      borderBottomWidth={3}
      borderColorTheme="neutral300"
      leftContent={
        <Button
          hitSlop={HitSlop.Large}
          type="common"
          size="small"
          leftIcon="arrow_ios_left_fill"
          textColorTheme="neutral900"
          leftIconSize={24}
          padding={4}
          onPress={() => goBack()}
        />
      }
      centerContent={
        <Text
          t18n="flight_ticket:flight_ticket"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
      }
      rightContent={
        <Button
          hitSlop={HitSlop.Large}
          leftIcon="excel_fill"
          leftIconSize={24}
          textColorTheme="primary500"
          padding={4}
          onPress={exportExcel}
        />
      }
    />
  );
};
