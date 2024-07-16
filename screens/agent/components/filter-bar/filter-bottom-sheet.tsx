import { Block, BottomSheet, Button } from '@vna-base/components';
import { SnapPoint, getState } from '@vna-base/utils';
import isEqual from 'lodash.isequal';
import React, { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { ContentFilter } from './content-filter';
import pickBy from 'lodash.pickby';
import isEmpty from 'lodash.isempty';
import { FilterFormInBottomSheet } from '@vna-base/screens/agent/type';
import { useStyles } from './styles';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';

export const FilterBottomSheet = forwardRef<
  NormalRef,
  {
    onDismiss: (data: FilterFormInBottomSheet) => void;
    closeBottomSheet: () => void;
  }
>(({ onDismiss, closeBottomSheet }, ref) => {
  const styles = useStyles();

  const tempFilterFormMethod = useForm<FilterFormInBottomSheet>({
    defaultValues: {
      Filter: {
        CustomerID: null,
        AgentCode: null,
        AgentName: null,
        // Contact: null,
        Phone: null,
        Email: null,
        // Address: null,
        AgentGroup: null,
        AgentType: null,
        Active: null,
      },
      // OrderBy: 'CustomerID',
      // SortType: SortTypeAxios.Desc,
      // GetAll: false,
    },
  });

  const _onDismiss = () => {
    let formInStore: any = {};
    let formData: any = {};

    const storedFilterForm = getState('agent').filterForm;

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
      // const { OrderBy, SortType, GetAll, ...res } = formData;
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
      snapPoints={[SnapPoint.Half]}
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
