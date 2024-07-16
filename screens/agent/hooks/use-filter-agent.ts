import {
  selectLoadingFilterAgent,
  selectResultFilterAgent,
} from '@redux-selector';
import { agentActions } from '@redux-slice';
import { Agent } from '@services/axios/axios-data';
import { dispatch } from '@vna-base/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FilterForm } from '../type';
import { SortType } from '@services/axios';

export const DefaultForm: FilterForm = {
  OrderBy: 'AgentCode',
  SortType: SortType.Asc,
  Filter: [],
  GetAll: false,
};

export const useFilterAgent = () => {
  const formMethod = useForm<FilterForm>({
    defaultValues: DefaultForm,
  });

  const { List, PageIndex, TotalPage, TotalItem } = useSelector(
    selectResultFilterAgent,
  );
  const loadingFilter = useSelector(selectLoadingFilterAgent);

  useEffect(() => {
    dispatch(agentActions.getListAgent(DefaultForm));
  }, []);

  useEffect(() => {
    const subscription = formMethod.watch(value => {
      dispatch(agentActions.getListAgent(value as FilterForm));
    });

    return () => subscription.unsubscribe();
  }, [formMethod]);

  const loadMore = useCallback(() => {
    if ((PageIndex ?? 0) < (TotalPage ?? 0)) {
      dispatch(agentActions.loadMoreAgent());
    }
  }, [PageIndex, TotalPage]);

  const handleRefresh = useCallback(() => {
    const form = formMethod.getValues();
    dispatch(agentActions.getListAgent(form));
  }, [formMethod]);

  const ListAgent = useMemo(() => {
    if (loadingFilter) {
      return Array(15).fill(null) as Array<Agent>;
    }

    if ((PageIndex ?? 0) < (TotalPage ?? 0)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return List!.concat([null]);
    }

    return List;
  }, [List, PageIndex, TotalPage, loadingFilter]);

  return {
    ListAgent,
    PageIndex,
    TotalPage,
    formMethod,
    loadMore,
    handleRefresh,
    TotalItem,
  };
};
