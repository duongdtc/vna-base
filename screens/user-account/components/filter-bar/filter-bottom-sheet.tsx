import { Block, BottomSheet, Button } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { getState } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import pickBy from 'lodash.pickby';
import React, { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { ContentFilter } from './content-filter';
// import { SortType as SortTypeAxios } from '@services/axios';
import { FilterFormInBottomSheet } from '@vna-base/screens/user-account/type';
import { useStyles } from './styles';

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
        Index: null,
        Username: null,
        FullName: null,
        UserGroupId: null,
        Status: null,
        Phone: null,
        Email: null,
      },
      // OrderBy: 'CustomerID',
      // SortType: SortTypeAxios.Desc,
      // GetAll: false,
    },
  });

  const _onDismiss = () => {
    let formInStore: any = {};
    let formData: any = {};

    const storedFilterForm = getState('userAccount').filterForm;

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
      snapPoints={['60%']}
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
          textColorTheme="white"
          buttonColorTheme="gra1"
          onPress={() => {
            closeBottomSheet();
          }}
        />
      </Block>
    </BottomSheet>
  );
});
