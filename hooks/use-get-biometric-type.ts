import CustomKeyChain from '@vna-base/utils/keychain';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export const useGetBiometricType = () => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppStateVisible(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (appStateVisible === 'active') {
      CustomKeyChain.getSupportedBiometryType();
    }
  }, [appStateVisible]);
};
