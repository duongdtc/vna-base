import { Block, Icon, Separator, Text } from '@vna-base/components';
import React, { memo, useCallback, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem, Pressable } from 'react-native';
import { useStyles } from './styles';
import { EmployeeItemProps } from '@vna-base/screens/report/type';
import { EmployeeItem } from './employee-item';

const data: Array<{
  revenue: number;
  date: string;
  fullName: string;
  id: string;
}> = [
  {
    id: 'lkja_kjahsdkj_lkjasdlkf',
    fullName: 'Super Admin',
    revenue: 3_950_000,
    date: '2024-03-15T09:35:07.744Z',
  },
  {
    id: 'lkjadsadf_kjahsdkj_lkjasdlkf',
    fullName: 'Designer',
    revenue: 2_900_000,
    date: '2024-03-16T09:35:07.744Z',
  },
  {
    id: 'lkja_ksdfgjahsdkj_lkjasdlkf',
    fullName: 'Mobile',
    revenue: 2_600_000,
    date: '2024-03-18T09:35:07.744Z',
  },
  {
    id: 'lkja_kjahsfgsdfgdkj_lkjasdlkf',
    fullName: 'Saler',
    revenue: 2_400_000,
    date: '2024-03-17T09:35:07.744Z',
  },
  {
    id: 'lkja_kjahshjdkj_lkjjjasdlkf',
    fullName: 'NET',
    revenue: 1_800_000,
    date: '2024-03-19T09:35:07.744Z',
  },
  {
    id: 'lkja_kjahsdkj_lkjasdlpiukf',
    fullName: 'Super Admin 2',
    revenue: 3_950_000,
    date: '2024-03-15T09:35:07.744Z',
  },
  {
    id: 'lkqwejadsadf_kjahsdkj_lkjasdlkf',
    fullName: 'Designer 2',
    revenue: 2_900_000,
    date: '2024-03-16T09:35:07.744Z',
  },
  {
    id: 'lkjaqwer_kjahsfgsdfgdkj_lkjasdlkf',
    fullName: 'Saler 2',
    revenue: 2_400_000,
    date: '2024-03-17T09:35:07.744Z',
  },
  {
    id: 'lkjsdfga_ksdfgjahsdkj_lkjasdlkf',
    fullName: 'Mobile 2',
    revenue: 2_600_000,
    date: '2024-03-18T09:35:07.744Z',
  },
  {
    id: 'lkja_kjahsvzxhhjdkj_lkjjjasdlkf',
    fullName: 'NET 2',
    revenue: 1_800_000,
    date: '2024-03-19T09:35:07.744Z',
  },
];

export const EmployeeTurnover = memo(() => {
  const styles = useStyles();

  const _data = useMemo<Array<EmployeeItemProps & { id: string }>>(
    () =>
      data.slice(0, 5).map(e => ({
        id: e.id,
        employeeFullName: e.fullName,
        revenue: e.revenue,
        maxRevenue: data[0].revenue,
      })),
    [],
  );

  const renderItem = useCallback<
    ListRenderItem<EmployeeItemProps & { id: string }>
  >(
    ({ item }) => (
      <EmployeeItem
        employeeFullName={item.employeeFullName}
        maxRevenue={item.maxRevenue}
        revenue={item.revenue}
      />
    ),
    [],
  );

  return (
    <Block colorTheme="neutral100">
      <Pressable style={styles.headerContainer}>
        <Text
          t18n="report:employee_turnover"
          fontStyle="Title16Semi"
          colorTheme="neutral900"
        />
        <Icon
          icon="arrow_ios_right_outline"
          size={20}
          colorTheme="neutral900"
        />
      </Pressable>
      <Separator type="horizontal" />

      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={_data}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={(it, idx) => `${it.id}_${idx}`}
        ItemSeparatorComponent={() => <Block height={22} />}
      />
    </Block>
  );
}, isEqual);
