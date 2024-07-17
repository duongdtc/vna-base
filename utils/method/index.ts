/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Platform } from 'react-native';

import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';

import { StorageKey, remove } from '@vna-base/utils';
import { dispatch } from '../redux';
import Actions from '@vna-base/redux/action-type';

type TypesBase =
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'number'
  | 'object'
  | 'string'
  | 'symbol'
  | 'undefined';

export const onShowErrorBase = (msg: string) => {
  Alert.alert(msg);
};

export const onCheckType = (
  source: any,
  type: TypesBase,
): source is TypesBase => {
  return typeof source === type;
};

export const checkKeyInObject = (T: Record<string, unknown>, key: string) => {
  return Object.keys(T).includes(key);
};

export const propsToStyle = (arrStyle: Array<any>) => {
  return arrStyle.filter(
    x => x !== undefined && !Object.values(x).some(v => v === undefined),
  );
};

/**
 * return true when success and false when error
 */
export function validResponse<T = any>(response: T) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  if (!response.data?.Success) {
    // TODO: handle error
    return false;
  }

  return true;
}

export const execFunc = <Fn extends (...args: any[]) => any>(
  func?: Fn,
  ...args: Parameters<Fn>
) => {
  if (onCheckType(func, 'function')) {
    func(...args);
  }
};

export const isIos = Platform.OS === 'ios';

export const logout = async () => {
  dispatch({ type: Actions.LOGOUT });
  await remove(StorageKey.TOKEN);
  await remove(StorageKey.USER_AGENT_ID);
};

export const handleErrorApi = (status: number | string) => {
  const _status = Number(status);
  const result = { status: false, code: status, msg: '' };

  if (_status > 505) {
    result.msg = translate('error:server_error');

    return result;
  }

  if (_status < 500 && _status >= 418) {
    result.msg = translate('error:error_on_request');

    return result;
  }

  result.msg = translate(('error:' + status) as I18nKeys);

  return result;
};

export function checkType<T>(variable: any, keys: (keyof T)[]): variable is T {
  if (typeof variable === 'object' && variable !== null) {
    for (const key of keys) {
      if (!(key in variable)) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export function delay(milliseconds = 500): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
