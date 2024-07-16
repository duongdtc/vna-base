import { Block, BottomSheet, Button } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { FilterFormInBottomSheet } from '@vna-base/screens/flight-ticket/type';
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
    onDismiss: (data: FilterFormInBottomSheet) => void;
    closeBottomSheet: () => void;
  }
>(({ onDismiss, closeBottomSheet }, ref) => {
  const styles = useStyles();
  const tempFilterFormMethod = useForm<FilterFormInBottomSheet>({
    defaultValues: {
      Filter: {
        AgentId: null,
        BookingCode: null,
        FullName: null,
        IssueUser: null,
        TicketNumber: null,
      },
    },
  });

  const _onDismiss = () => {
    let formInStore: any = {};
    let formData: any = {};

    const storedFilterForm = getState('flightTicket').filterForm;

    storedFilterForm?.Filter.forEach(ft => {
      formInStore[ft.Name] = ft.Value;
    });

    formInStore = pickBy(formInStore, value => !isEmpty(value));

    formData = pickBy(
      tempFilterFormMethod.getValues().Filter,
      value => !isEmpty(value),
    );

    if (!isEqual(formInStore, formData)) {
      onDismiss({
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
      snapPoints={[SnapPoint['60%']]}
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
