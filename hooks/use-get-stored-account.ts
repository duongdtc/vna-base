/* eslint-disable react-hooks/exhaustive-deps */

import { FormLoginType } from '@screens/login/type';
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

      const agentcode = load(StorageKey.AGENT_CODE);

      if (agentcode) {
        formMethod.setValue('AgentCode', agentcode);
      }
    } catch (error) {}
  }, []);
  useEffect(() => {
    getAccountRemember();
  }, []);
}
