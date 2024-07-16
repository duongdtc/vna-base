/* eslint-disable react-hooks/exhaustive-deps */
import { FormLoginType } from '@vna-base/screens/login/type';
import { load } from '@vna-base/utils';
import { StorageKey } from '@vna-base/utils/storage/constants';
import { useCallback, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export function useGetStoredAccount(
  formMethod: UseFormReturn<FormLoginType, any>,
) {
  const getAccountRemember = useCallback(async () => {
    try {
      const username = load(StorageKey.USERNAME);
      if (username) {
        formMethod.setValue('Username', username);
      }
    } catch (error) {}
  }, []);
  useEffect(() => {
    getAccountRemember();
  }, []);
}
