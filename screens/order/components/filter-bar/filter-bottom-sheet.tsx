import { Block, BottomSheet, Button } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { FilterFormInBottomSheet } from '@vna-base/screens/order/type';
import { SnapPoint, getState } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import pickBy from 'lodash.pickby';
import React, { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { ContentFilter } from './content-filter';
import { useStyles } from './styles';

export const FilterBottomSheet = forwardRef<
  NormalRef,
  {
    onDismiss: (data: Omit<FilterFormInBottomSheet, 'OrderStatus'>) => void;
    closeBottomSheet: () => void;
  }
>(({ onDismiss, closeBottomSheet }, ref) => {
  const styles = useStyles();
  const tempFilterFormMethod = useForm<
    Omit<FilterFormInBottomSheet, 'OrderStatus'>
  >({
    defaultValues: {
      Filter: {
        Index: null,
        // OrderStatus: null,
        FlightBooking: null,
        // FlightInfo: null,
        // FlightSystem: null,
        PaxName: null,
        // PaxSumm: null,
        // NetPrice: null,
        // TotalPrice: null,
        // Profit: null,
        // PaidAmt: null,
        // Currency: null,
        // SubAgName: null,
        AgentName: null,
        // ContactName: null,
        ContactPhone: null,
        // ContactEmail: null,
        // CreatedUser: null,
        MonitorUser: null,
        // PaymentMethod: null,
        // PaymentStatus: null,
      },
      // OrderBy: 'Index',
      // SortType: SortTypeAxios.Desc,
      // GetAll: false,
    },
  });

  const _onDismiss = () => {
    let formInStore: any = {};
    let formData: any = {};

    const storedFilterForm = getState('order').filterForm;

    storedFilterForm?.Filter.forEach(ft => {
      formInStore[ft.Name] = ft.Value;
    });

    formInStore = pickBy(formInStore, value => !isEmpty(value));

    // formInStore.OrderBy = storedFilterForm?.OrderBy;
    // formInStore.SortType = storedFilterForm?.SortType;
    // formInStore.GetAll = storedFilterForm?.GetAll;

    formData = pickBy(
      tempFilterFormMethod.getValues().Filter,
      value => !isEmpty(value),
    );

    // formData.OrderBy = tempFilterFormMethod.getValues().OrderBy;
    // formData.SortType = tempFilterFormMethod.getValues().SortType;
    // formData.GetAll = tempFilterFormMethod.getValues().GetAll;

    if (!isEqual(formInStore, formData)) {
      onDismiss({
        // OrderBy,
        // SortType,
        // GetAll,
        Filter: formData,
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
      snapPoints={[SnapPoint['65%']]}
      t18nDone="common:reset"
      onDone={reset}
      t18nTitle="common:_filter"
      showIndicator={false}>
      <ContentFilter
        formMethod={tempFilterFormMethod}
        closeBottomSheet={closeBottomSheet}
      />
      <Block style={styles.confirmContainer}>
        <Button
          fullWidth
          t18n="common:confirm"
          textColorTheme="classicWhite"
          buttonColorTheme="primary500"
          onPress={() => {
            closeBottomSheet();
          }}
        />
      </Block>
    </BottomSheet>
  );
});
