import { useEffect } from 'react';

export const useDebounce = <T>(value: T, cb?: (v: T) => void, delay = 300) => {
  useEffect(() => {
    const timer = setTimeout(() => cb?.(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, cb]);
};
