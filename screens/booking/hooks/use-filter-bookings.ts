/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  selectLoadingFilterBooking,
  selectResultFilterBooking,
} from '@vna-base/redux/selector';
import { bookingActions } from '@vna-base/redux/action-slice';
import { SortType } from '@services/axios';
import { BookingStatus, dispatch } from '@vna-base/utils';
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
  OrderBy: 'OrderCode',
  SortType: SortType.Desc,
  Filter: [
    {
      Name: 'BookingStatus',
      Value: BookingStatus.ALL,
      Contain: true,
    },
  ],
  GetAll: false,
};

export const useFilterBooking = () => {
  const formMethod = useForm<FilterForm>({
    defaultValues: DefaultForm,
  });

  const { list, pageIndex, totalPage } = useSelector(selectResultFilterBooking);
  const loadingFilter = useSelector(selectLoadingFilterBooking);

  useEffect(() => {
    dispatch(bookingActions.getListBookings({ filterForm: DefaultForm }));
  }, []);

  useEffect(() => {
    const subscription = formMethod.watch(value => {
      dispatch(
        bookingActions.getListBookings({ filterForm: value as FilterForm }),
      );
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);

  const loadMore = useCallback(() => {
    if (pageIndex < totalPage) {
      dispatch(bookingActions.getListBookings({ pageIndex: pageIndex + 1 }));
    }
  }, [pageIndex, totalPage]);

  const handleRefresh = useCallback(() => {
    dispatch(
      bookingActions.getListBookings({ filterForm: formMethod.getValues() }),
    );
  }, [formMethod]);

  const listBookingIds = useMemo(() => {
    if (loadingFilter) {
      return Array(15).fill(null) as Array<string>;
    }

    if (pageIndex < totalPage) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return list!.concat([null]);
    }

    return list;
  }, [list, pageIndex, totalPage, loadingFilter]);

  return {
    list: listBookingIds,
    pageIndex,
    totalPage,
    formMethod,
    loadMore,
    handleRefresh,
  };
};
