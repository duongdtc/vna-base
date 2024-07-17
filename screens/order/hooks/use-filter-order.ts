/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  selectLoadingFilterOrder,
  selectResultFilterOrder,
} from '@vna-base/redux/selector';
import { orderActions } from '@vna-base/redux/action-slice';
import { SortType } from '@services/axios';
import { dispatch } from '@vna-base/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FilterForm } from '../type';

const DefaultForm: FilterForm = {
  Range: {
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  },
  OrderBy: 'CreatedDate',
  SortType: SortType.Desc,
  Filter: [],
  GetAll: true,
};

export const useFilterOrder = () => {
  const formMethod = useForm<FilterForm>({
    defaultValues: DefaultForm,
  });

  const { list, pageIndex, totalPage } = useSelector(selectResultFilterOrder);
  const loadingFilter = useSelector(selectLoadingFilterOrder);

  useEffect(() => {
    dispatch(orderActions.getListOrder({ filterForm: DefaultForm }));
  }, []);

  useEffect(() => {
    const subscription = formMethod.watch(value => {
      dispatch(
        orderActions.getListOrder({
          filterForm: value as FilterForm,
        }),
      );
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);

  const loadMore = useCallback(() => {
    if (pageIndex < totalPage) {
      dispatch(orderActions.getListOrder({ pageIndex: pageIndex + 1 }));
    }
  }, [pageIndex, totalPage]);

  const handleRefresh = useCallback(() => {
    dispatch(orderActions.getListOrder({ filterForm: formMethod.getValues() }));
  }, [formMethod]);

  const listOrderId = useMemo(() => {
    if (loadingFilter) {
      return Array(15).fill(null) as Array<string>;
    }

    if (pageIndex < totalPage) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return list!.concat([null]);
    }

    return list;
  }, [loadingFilter, pageIndex, totalPage, list]);

  return {
    list: listOrderId,
    pageIndex,
    totalPage,
    formMethod,
    loadMore,
    handleRefresh,
  };
};
