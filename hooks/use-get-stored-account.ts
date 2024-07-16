/* eslint-disable react-hooks/exhaustive-deps */
import { FormLoginType } from '@screens/login/type';
import { load } from '@utils';
import { StorageKey } from '@utils/storage/constants';
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
