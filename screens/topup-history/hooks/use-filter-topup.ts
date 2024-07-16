import { topupActions } from '@redux-slice';
import {
  selectLoadingFilterTopup,
  selectResultFilterTopup,
} from '@redux/selector/topup';
import { SortType } from '@services/axios';
import { dispatch } from '@vna-base/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { TopupFilterForm } from '../type';

const DefaultForm: TopupFilterForm = {
  OrderBy: 'CreatedDate',
  SortType: SortType.Desc,
  Filter: [],
  GetAll: false,
  Range: {
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  },
};

export const useFilterTopup = () => {
  const formMethod = useForm<TopupFilterForm>({
    defaultValues: DefaultForm,
  });

  const { list, pageIndex, totalPage } = useSelector(selectResultFilterTopup);
  const loadingFilter = useSelector(selectLoadingFilterTopup);

  useEffect(() => {
    dispatch(topupActions.getListTopupHistory({ filterForm: DefaultForm }));
  }, []);

  useEffect(() => {
    const subscription = formMethod.watch(value => {
      dispatch(
        topupActions.getListTopupHistory({
          filterForm: value as TopupFilterForm,
        }),
      );
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);

  const loadMore = useCallback(() => {
    if (pageIndex < totalPage) {
      dispatch(topupActions.getListTopupHistory({ pageIndex: pageIndex + 1 }));
    }
  }, [pageIndex, totalPage]);

  const handleRefresh = useCallback(() => {
    dispatch(
      topupActions.getListTopupHistory({
        filterForm: formMethod.getValues(),
      }),
    );
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
