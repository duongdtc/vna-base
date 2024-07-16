import {
  selectResultFilterPaymentHistory,
  selectLoadingFilterPaymentHistory,
} from '@redux-selector';
import { paymentActions } from '@redux-slice';
import { SortType } from '@services/axios';
import { dispatch } from '@vna-base/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { PaymentHistoryFilterForm } from '../type';

const DefaultForm: PaymentHistoryFilterForm = {
  OrderBy: 'Index',
  SortType: SortType.Desc,
  Filter: [],
  GetAll: false,
  Range: {
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  },
};

export const useFilterPayment = () => {
  const formMethod = useForm<PaymentHistoryFilterForm>({
    defaultValues: DefaultForm,
  });

  const { list, pageIndex, totalPage } = useSelector(
    selectResultFilterPaymentHistory,
  );
  const loadingFilter = useSelector(selectLoadingFilterPaymentHistory);

  useEffect(() => {
    dispatch(paymentActions.getListPaymentHistory({ filterForm: DefaultForm }));
  }, []);

  useEffect(() => {
    const subscription = formMethod.watch(value => {
      dispatch(
        paymentActions.getListPaymentHistory({
          filterForm: value as PaymentHistoryFilterForm,
        }),
      );
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);

  const loadMore = useCallback(() => {
    if (pageIndex < totalPage) {
      dispatch(
        paymentActions.getListPaymentHistory({
          pageIndex: pageIndex + 1,
        }),
      );
    }
  }, [pageIndex, totalPage]);

  const handleRefresh = useCallback(() => {
    dispatch(
      paymentActions.getListPaymentHistory({
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
