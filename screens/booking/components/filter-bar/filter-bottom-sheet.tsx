import { BottomSheet } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { FilterFormInBottomSheet } from '@vna-base/screens/booking/type';
import { SortType as SortTypeAxios } from '@services/axios';
import { SnapPoint, getState } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import pickBy from 'lodash.pickby';
import React, { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { ContentFilter } from './content-filter';

export const FilterBottomSheet = forwardRef<
  NormalRef,
  {
    onDismiss: (data: FilterFormInBottomSheet) => void;
    closeBottomSheet: () => void;
  }
>(({ onDismiss, closeBottomSheet }, ref) => {
  const tempFilterFormMethod = useForm<FilterFormInBottomSheet>({
    defaultValues: {
      Filter: {
        Airline: null,
        BookingCode: null,
        BookingStatus: null,
        OrderCode: null,
        System: null,
        Itinerary: null,
        StartPoint: null,
        EndPoint: null,
        FlightType: null,
        PaxName: null,
        PaxSumm: null,
        TimePurchase: null,
        NetPrice: null,
        TotalPrice: null,
        Profit: null,
        Currency: null,
        FareClass: null,
        FareBasis: null,
        ContactPhone: null,
        ContactEmail: null,
        SubAgName: null,
        AgentName: null,
        // ResponseTime: null,
        // ErrorMessage: null,
        CreatedUser: null,
      },
      OrderBy: 'OrderCode',
      SortType: SortTypeAxios.Desc,
      GetAll: false,
    },
  });

  const _onDismiss = () => {
    let formInStore: any = {};
    let formData: any = {};

    const storedFilterForm = getState('bookings').filterForm;

    storedFilterForm?.Filter.forEach(ft => {
      formInStore[ft.Name] = ft.Value;
    });

    formInStore = pickBy(formInStore, value => !isEmpty(value));

    formInStore.OrderBy = storedFilterForm?.OrderBy;
    formInStore.SortType = storedFilterForm?.SortType;
    formInStore.GetAll = storedFilterForm?.GetAll;

    formData = pickBy(
      tempFilterFormMethod.getValues().Filter,
      value => !isEmpty(value),
    );

    formData.OrderBy = tempFilterFormMethod.getValues().OrderBy;
    formData.SortType = tempFilterFormMethod.getValues().SortType;
    formData.GetAll = tempFilterFormMethod.getValues().GetAll;

    if (!isEqual(formInStore, formData)) {
      const { OrderBy, SortType, GetAll, ...res } = formData;
      onDismiss({
        OrderBy,
        SortType,
        GetAll,
        Filter: res,
      });
    }
  };

  const reset = () => {
    tempFilterFormMethod.reset();
    closeBottomSheet();
  };

  return (
    <BottomSheet
      paddingBottom={true}
      ref={ref}
      enablePanDownToClose={false}
      typeBackDrop="gray"
      type="normal"
      onDismiss={_onDismiss}
      useDynamicSnapPoint={false}
      snapPoints={[SnapPoint.Half]}
      t18nDone="common:reset"
      onDone={reset}
      t18nTitle="common:_filter"
      showIndicator={false}>
      <ContentFilter
        formMethod={tempFilterFormMethod}
        closeBottomSheet={closeBottomSheet}
      />
    </BottomSheet>
  );
});
