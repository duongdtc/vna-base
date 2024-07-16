import { IconTypes } from '@assets/icon';
import { hideModalConfirm, showModalConfirm } from '@vna-base/components';
import { selectSupportedBiometryType } from '@redux-selector';
import { FormLoginType } from '@vna-base/screens/login/type';
import CustomKeyChain from '@vna-base/utils/keychain';
import { useCallback, useMemo, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BIOMETRY_TYPE } from 'react-native-keychain';
import { useSelector } from 'react-redux';

export const useBiometric = (
  formMethod: UseFormReturn<FormLoginType, any>,
  getInternetCredentialSuccess: () => void,
) => {
  const supportedBiometryType = useSelector(selectSupportedBiometryType);

  const accountRef = useRef<FormLoginType>();

  const login = useCallback(() => {
    hideModalConfirm();
    formMethod.setValue('Username', accountRef.current?.Username ?? '');
    formMethod.setValue('Password', accountRef.current?.Password ?? '');
    getInternetCredentialSuccess();
  }, [getInternetCredentialSuccess, formMethod]);

  const getAccountRemember = useCallback(async () => {
    try {
      const result = await CustomKeyChain.getInternetCredentials();
      if (!result) {
        showModalConfirm({
          t18nTitle: 'modal_confirm:no_account_saved',
          t18nSubtitle: 'modal_confirm:manual_login',
          t18nCancel: 'modal_confirm:close',
        });

        return;
      }

      const { username, password } = result;

      accountRef.current = {
        Username: username,
        Password: password,
      };
      if (
        formMethod.getValues().Username === '' ||
        formMethod.getValues().Username === username
      ) {
        formMethod.setValue('Username', username);
        formMethod.setValue('Password', password);
        getInternetCredentialSuccess();
      } else {
        showModalConfirm({
          t18nTitle: 'modal_confirm:not_matching_account',
          t18nSubtitle: 'modal_confirm:continue_login',
          onOk: login,
        });
      }
    } catch (error) {}
  }, [getInternetCredentialSuccess, formMethod, login]);

  const biometricIcon = useMemo<IconTypes | undefined>(() => {
    if (
      supportedBiometryType === BIOMETRY_TYPE.FACE_ID ||
      supportedBiometryType === BIOMETRY_TYPE.FACE ||
      supportedBiometryType === BIOMETRY_TYPE.IRIS
    ) {
      return 'faceid';
    } else if (
      supportedBiometryType === BIOMETRY_TYPE.FINGERPRINT ||
      supportedBiometryType === BIOMETRY_TYPE.TOUCH_ID
    ) {
      return 'finger_print';
    } else {
      return undefined;
    }
  }, [supportedBiometryType]);

  return {
    biometricIcon,
    getAccountRemember,
  };
};
