import {
  selectLoadingFilterUserGroup,
  selectResultListUserGroup,
} from '@redux-selector';
import { userGroupActions } from '@redux-slice';
import { FilterFormUserGroup } from '@vna-base/screens/agent-detail/type';
import { SortType } from '@services/axios';
import { UserGroup } from '@services/axios/axios-data';
import { dispatch } from '@vna-base/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

export const useFilterUserGroup = () => {
  const formMethod = useForm<FilterFormUserGroup>({
    defaultValues: {
      OrderBy: 'Code',
      SortType: SortType.Desc,
      Filter: [
        {
          Contain: true,
          Name: 'Level',
          Value: '',
        },
      ],
    },
  });

  const { List, PageIndex, TotalPage } = useSelector(selectResultListUserGroup);
  const loadingFilter = useSelector(selectLoadingFilterUserGroup);

  useEffect(() => {
    dispatch(
      userGroupActions.getListUserGroup({
        OrderBy: 'Code',
        SortType: SortType.Desc,
        Filter: [
          {
            Contain: true,
            Name: 'Level',
            Value: '',
          },
        ],
      }),
    );
  }, []);

  // useEffect(() => {
  //   const subscription = formMethod.watch(value => {
  //     dispatch(UserGroupActions.getListUserGroup(value as FilterFormUserGroup));
  //   });

  //   return () => subscription.unsubscribe();
  // }, [formMethod]);

  const handleRefresh = useCallback(() => {
    const form = formMethod.getValues();
    dispatch(userGroupActions.getListUserGroup(form));
  }, [formMethod]);

  const ListUserGroup = useMemo(() => {
    if (loadingFilter) {
      return Array(15).fill(null) as Array<UserGroup>;
    }

    if ((PageIndex ?? 0) < (TotalPage ?? 0)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return List!.concat([null]);
    }

    return List;
  }, [List, PageIndex, TotalPage, loadingFilter]);

  return {
    ListUserGroup,
    PageIndex,
    TotalPage,
    formMethod,
    handleRefresh,
  };
};
