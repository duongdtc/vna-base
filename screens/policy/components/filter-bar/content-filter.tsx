import { RowOfForm, Separator } from '@vna-base/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectAllAgentGroup, selectAllAirGroups } from '@vna-base/redux/selector';
import { FilterFormInBottomSheet } from '@vna-base/screens/policy/type';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { DepArrArea } from './dep-arr-area';
import { useStyles } from './styles';

export const ContentFilter = ({
  formMethod,
}: {
  formMethod: UseFormReturn<FilterFormInBottomSheet, any>;
  closeBottomSheet: () => void;
}) => {
  const styles = useStyles();
  const allAgentGroups = useSelector(selectAllAgentGroup);
  const allAirGroups = useSelector(selectAllAirGroups);

  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      style={styles.bottomSheetContainer}
      contentContainerStyle={styles.bottomSheetContentContainer}>
      <Separator type="horizontal" size={3} />
      {/* Nhóm khách hàng  */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={allAgentGroups}
        t18n="policy:agent_group"
        t18nBottomSheet="policy:agent_group"
        name="Filter.AgentGroup"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />
      {/* Nhóm hãng  */}
      <RowOfForm<FilterFormInBottomSheet>
        type="dropdown"
        typeDetails={allAirGroups}
        t18n="policy:air_group"
        t18nBottomSheet="policy:air_group"
        name="Filter.AirGroup"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />
      {/* Khu vực đi */}
      <DepArrArea
        t18n="policy_detail:departure_area"
        name="Filter.StartPoint"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* Khu vuwjc đến */}
      <DepArrArea
        t18n="policy_detail:arrival_area"
        name="Filter.EndPoint"
        control={formMethod.control}
      />
      <Separator type="horizontal" size={3} />

      {/* Hạng chỗ */}
      <RowOfForm<FilterFormInBottomSheet>
        control={formMethod.control}
        t18n="policy:fare_class"
        maxLength={80}
        name="Filter.FareClassApply"
        autoCapitalize={'characters'}
        t18nAll="common:type_to_search"
        useBottomSheetInput={true}
      />
      <Separator type="horizontal" size={3} />
    </BottomSheetScrollView>
  );
};
