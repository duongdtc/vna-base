import { userAccountActions } from '@vna-base/redux/action-slice';
import { UserAccount } from '@services/axios/axios-data';
import { dispatch } from '@vna-base/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FilterForm } from '../type';
import { SortType } from '@services/axios';
import {
  selectLoadingFilterUserAccount,
  selectResultFilterUserAccount,
} from '@vna-base/redux/selector';

export const DefaultForm: FilterForm = {
  OrderBy: 'LastLoginDate',
  SortType: SortType.Desc,
  Filter: [],
  GetAll: false,
};

export const useFilterUserAccount = () => {
  const formMethod = useForm<FilterForm>({
    defaultValues: DefaultForm,
  });

  const { List, PageIndex, TotalPage, TotalItem } = useSelector(
    selectResultFilterUserAccount,
  );
  const loadingFilter = useSelector(selectLoadingFilterUserAccount);

  useEffect(() => {
    dispatch(userAccountActions.getListUserAccount(DefaultForm));
  }, []);

  useEffect(() => {
    const subscription = formMethod.watch(value => {
      dispatch(userAccountActions.getListUserAccount(value as FilterForm));
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);

  const loadMore = useCallback(() => {
    if ((PageIndex ?? 0) < (TotalPage ?? 0)) {
      dispatch(userAccountActions.loadMoreUserAccount());
    }
  }, [PageIndex, TotalPage]);

  const handleRefresh = useCallback(() => {
    const form = formMethod.getValues();
    dispatch(userAccountActions.getListUserAccount(form));
  }, [formMethod]);

  const ListUserAccount = useMemo(() => {
    if (loadingFilter) {
      return Array(15).fill(null) as Array<UserAccount>;
    }

    if ((PageIndex ?? 0) < (TotalPage ?? 0)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return List!.concat([null]);
    }

    return List;
  }, [List, PageIndex, TotalPage, loadingFilter]);

  return {
    ListUserAccount,
    PageIndex,
    TotalPage,
    formMethod,
    loadMore,
    handleRefresh,
    TotalItem,
  };
};
