/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  selectIsLoadingFilterFlightTicket,
  selectResultFilterFlightTicket,
} from '@redux-selector';
import { flightTicketActions } from '@redux-slice';
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
  OrderBy: 'IssueDate',
  SortType: SortType.Desc,
  Filter: [],
  GetAll: false,
};

export const useFilterFlightTicket = () => {
  const formMethod = useForm<FilterForm>({
    defaultValues: DefaultForm,
  });

  const { list, pageIndex, totalPage } = useSelector(
    selectResultFilterFlightTicket,
  );
  const isLoadingFilter = useSelector(selectIsLoadingFilterFlightTicket);

  useEffect(() => {
    dispatch(
      flightTicketActions.getListFlightTicket({ filterForm: DefaultForm }),
    );
  }, []);

  useEffect(() => {
    const subscription = formMethod.watch(value => {
      dispatch(
        flightTicketActions.getListFlightTicket({
          filterForm: value as FilterForm,
        }),
      );
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);

  const loadMore = useCallback(() => {
    if (pageIndex < totalPage) {
      dispatch(
        flightTicketActions.getListFlightTicket({ pageIndex: pageIndex + 1 }),
      );
    }
  }, [pageIndex, totalPage]);

  const handleRefresh = useCallback(() => {
    const form = formMethod.getValues();
    dispatch(flightTicketActions.getListFlightTicket({ filterForm: form }));
  }, [formMethod]);

  const listFlightTicketId = useMemo(() => {
    if (isLoadingFilter) {
      return Array(15).fill(null) as Array<string>;
    }

    if (pageIndex < totalPage) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return list!.concat([null]);
    }

    return list;
  }, [isLoadingFilter, list, pageIndex, totalPage]);

  return {
    list: listFlightTicketId,
    pageIndex,
    totalPage,
    formMethod,
    loadMore,
    handleRefresh,
  };
};
