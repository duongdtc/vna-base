/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  selectIsLoadingFilterPolicy,
  selectResultFilterPolicy,
} from '@vna-base/redux/selector';
import { policyActions } from '@vna-base/redux/action-slice';
import { SortType } from '@services/axios';
import { Policy } from '@services/axios/axios-data';
import { dispatch } from '@vna-base/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FilterForm } from '../type';

const DefaultForm: FilterForm = {
  OrderBy: 'AgentGroup',
  SortType: SortType.Desc,
  Filter: [],
  GetAll: false,
};

export const useFilterOrder = () => {
  const formMethod = useForm<FilterForm>({
    defaultValues: DefaultForm,
  });

  const { list, pageIndex, totalPage } = useSelector(selectResultFilterPolicy);
  const loadingFilter = useSelector(selectIsLoadingFilterPolicy);

  useEffect(() => {
    dispatch(policyActions.getListPolicy({ form: DefaultForm }));
  }, []);

  useEffect(() => {
    const subscription = formMethod.watch(value => {
      dispatch(policyActions.getListPolicy({ form: value as FilterForm }));
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);

  const loadMore = useCallback(() => {
    if ((pageIndex ?? 0) < (totalPage ?? 0)) {
      dispatch(policyActions.getListPolicy({ pageIndex: pageIndex + 1 }));
    }
  }, []);

  const handleRefresh = useCallback(() => {
    const form = formMethod.getValues();
    dispatch(policyActions.getListPolicy({ form }));
  }, [formMethod]);

  const listPolicy = useMemo(() => {
    if (loadingFilter) {
      return Array(15).fill(null) as Array<Policy>;
    }

    if ((pageIndex ?? 0) < (totalPage ?? 0)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return list!.concat([null]);
    }

    return list;
  }, [list, loadingFilter, pageIndex, totalPage]);

  return {
    list: listPolicy,
    pageIndex,
    totalPage,
    formMethod,
    loadMore,
    handleRefresh,
  };
};
