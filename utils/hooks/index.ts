/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  EmitterSubscription,
  Keyboard,
  KeyboardEvent,
  Platform,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import {
  hideLoading,
  hideModalConfirm,
  showLoading,
  showModalConfirm,
} from '@vna-base/components';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { AppTheme, useTheme } from '@theme';
import { StorageKey, onCheckType, save } from '@vna-base/utils';
import { ValidateMessageObject } from '@vna-base/utils/string/type';

import RNExitApp from 'react-native-exit-app';

type NetInfoTuple = [boolean, boolean];
function useNetWorkStatus(): NetInfoTuple {
  const [status, setStatus] = useState<boolean>(false);

  const [canAccess, setCanAccess] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus(state.isConnected ?? false);

      setCanAccess(state.isInternetReachable ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return [status, canAccess];
}

function useInterval(callback: Function, delay: number) {
  const savedCallback = useRef<Function>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay]);
}

function usePrevious<T = any>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

type UseSetArrayStateAction<T extends object> = React.Dispatch<
  SetStateAction<Partial<T>>
>;
type UseSetStateArray<T extends object> = [
  T,
  UseSetArrayStateAction<T>,
  () => void,
];
function useSetStateArray<T extends object>(
  initialValue: T,
): UseSetStateArray<T> {
  const [value, setValue] = useState<T>(initialValue);

  const setState = useCallback(
    (v: SetStateAction<Partial<T>>) => {
      return setValue(oldValue => ({
        ...oldValue,
        ...(typeof v === 'function' ? v(oldValue) : v),
      }));
    },
    [setValue],
  );

  const resetState = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setState, resetState];
}

type UseSetStateAction<T extends object> = React.Dispatch<
  SetStateAction<Partial<T>>
>;
type UseSetState<T extends object> = {
  setState: UseSetStateAction<T>;
  state: T;
  resetState: () => void;
};
function useSetState<T extends object>(initialValue: T): UseSetState<T> {
  const [state, setState, resetState] = useSetStateArray(initialValue);

  return useMemo(
    () => ({
      setState,
      resetState,
      state,
    }),
    [setState, resetState, state],
  );
}

function useStyle<T>(style: (theme: AppTheme) => T): T {
  const theme = useTheme();

  return style(theme);
}

function useAsyncState<T>(
  initialValue: T,
): [
  T,
  (newValue: SetStateAction<T>, callback?: (newState: T) => void) => void,
] {
  const [state, setState] = useState(initialValue);

  const _callback = useRef<(newState: T) => void>();

  const _setState = (
    newValue: SetStateAction<T>,
    callback?: (newState: T) => void,
  ) => {
    if (callback) {
      _callback.current = callback;
    }

    setState(newValue);
  };

  useEffect(() => {
    if (typeof _callback.current === 'function') {
      _callback.current(state);

      _callback.current = undefined;
    }
  }, [state]);

  return [state, _setState];
}

function useUnMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(() => () => callback(), []);
}

function useDidMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(callback, []);
}

function useForceUpdate() {
  const unloadingRef = useRef(false);

  const [forcedRenderCount, setForcedRenderCount] = useState(0);

  useUnMount(() => (unloadingRef.current = true));

  return useCallback(() => {
    !unloadingRef.current && setForcedRenderCount(forcedRenderCount + 1);
  }, [forcedRenderCount]);
}

function useIsKeyboardShown() {
  const [data, setData] = React.useState({ isShow: false, height: 0 });

  React.useEffect(() => {
    const handleKeyboardShow = (e: KeyboardEvent) =>
      setData({ isShow: true, height: e.endCoordinates.height });

    const handleKeyboardHide = (e: KeyboardEvent) =>
      setData({ isShow: false, height: e.endCoordinates.height });

    let keyboardWillShow: EmitterSubscription;
    let keyboardWillHide: EmitterSubscription;
    let keyboardDidShow: EmitterSubscription;
    let keyboardDidHide: EmitterSubscription;
    if (Platform.OS === 'ios') {
      keyboardWillShow = Keyboard.addListener(
        'keyboardWillShow',
        handleKeyboardShow,
      );

      keyboardWillHide = Keyboard.addListener(
        'keyboardWillHide',
        handleKeyboardHide,
      );
    } else {
      keyboardDidShow = Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardShow,
      );

      keyboardDidHide = Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardHide,
      );
    }

    return () => {
      if (Platform.OS === 'ios') {
        keyboardWillShow.remove();

        keyboardWillHide.remove();
      } else {
        keyboardDidShow.remove();

        keyboardDidHide.remove();
      }
    };
  }, []);

  return data;
}

function useDisableBackHandler(disabled: boolean, callback?: () => void) {
  // function
  const onBackPress = useCallback(() => {
    if (onCheckType(callback, 'function')) {
      callback();
    }

    return true;
  }, [callback]);

  useEffect(() => {
    if (disabled) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [disabled, onBackPress]);
}

function useDismissKeyboard(isHide: boolean) {
  useEffect(() => {
    if (isHide) {
      Keyboard.dismiss();
    }
  }, [isHide]);
}

function useMounted(callback: () => void, deps: any[] = []) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}

function useErrorMessageTranslation(msg?: string) {
  const [t] = useTranslation();

  const parsed = useMemo<ValidateMessageObject | undefined>(() => {
    if (!msg) {
      return undefined;
    }

    try {
      return JSON.parse(msg);
    } catch {
      return undefined;
    }
  }, [msg]);

  return useMemo<string | undefined>(() => {
    if (!parsed && typeof msg === 'string') {
      return t(msg);
    }

    if (!parsed) {
      return undefined;
    }

    const optionsTx: Record<string, string> = {};

    if (parsed.optionsTx) {
      Object.keys(parsed.optionsTx).forEach(key => {
        optionsTx[key] = t(
          String((parsed.optionsTx as Record<string, string | number>)[key]),
        );
      });
    }

    return t(parsed.keyT, { ...(parsed.options ?? {}), ...optionsTx });
    // return t(parsed.keyT);
  }, [parsed, t, msg]);
}

/**
 * @description Like 'useCallback' but with empty deps array.
 * Don't use this hooks when you want to render something on React Tree.
 * It will return previous value like usePrevious. first render will return undefined.
 * @example
 * This will render the previous value. don't use this:
 * ```tsx
 * const total = useEventCallback(() => state1 + state2)
 * <Text>{total()}</Text>
 * ```
 *
 * Use this:
 * ```tsx
 * const [msg,setMsg] = useState('');
 * const sendMsg = useEventCallback(() => sendMsgToApi(msg));
 * ```
 */
const useEventCallback = <Fn extends (...args: any[]) => ReturnType<Fn>>(
  func: Fn,
) => {
  const callbackRef = useRef<(...args: Parameters<Fn>) => ReturnType<Fn>>();

  const callbackMemoized = useCallback((...args: Parameters<Fn>) => {
    return callbackRef.current?.(...args);
  }, []);

  useLayoutEffect(() => {
    callbackRef.current = (...args) => func(...args);
  });

  return callbackMemoized;
};

function useNetInfo() {
  const _closeApp = () => {
    RNExitApp.exitApp();
  };

  const _reconnect = async () => {
    showLoading();
    await NetInfo.refresh();
    hideLoading();
  };

  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        showModalConfirm({
          t18nTitle: 'modal_confirm:no_internet',
          t18nSubtitle: 'modal_confirm:turn_on_connect',
          t18nOk: 'modal_confirm:try_again',
          t18nCancel: 'modal_confirm:exit',
          hideWhenDone: false,
          onCancel: _closeApp,
          onOk: _reconnect,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        save(StorageKey.IP_ADDRESS, state.details?.ipAddress);
        hideModalConfirm();
      }
    });
    // Unsubscribe
    return unsubscribe;
  }, []);
}

export {
  useAsyncState,
  useDidMount,
  useDisableBackHandler,
  useDismissKeyboard,
  useErrorMessageTranslation,
  useEventCallback,
  useForceUpdate,
  useInterval,
  useIsKeyboardShown,
  useMounted,
  useNetInfo,
  useNetWorkStatus,
  usePrevious,
  useSetState,
  useStyle,
  useUnMount,
};
