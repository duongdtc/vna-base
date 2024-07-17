import { BUNDLE_IDENTIFIER_IOS, BUNDLE_IDENTIFIER_ANDROID } from '@env';
import { appActions } from '@vna-base/redux/action-slice';
import { dispatch } from '@vna-base/utils/redux';
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

const SERVER_NAME =
  Platform.OS === 'android' ? BUNDLE_IDENTIFIER_ANDROID : BUNDLE_IDENTIFIER_IOS;

const setGenericPassword = async (username: string, password: string) => {
  try {
    await Keychain.setGenericPassword(username, password);
    return { status: true };
  } catch (e) {
    console.log('keychain access failed ', e);
    return { status: false, error: e };
  }
};

const getGenericPassword = async () => {
  try {
    const genericPassword = await Keychain.getGenericPassword();

    if (
      typeof genericPassword !== 'boolean' &&
      genericPassword?.username &&
      genericPassword?.password
    ) {
      return {
        status: true,
        username: genericPassword?.username,
        password: genericPassword?.password,
      };
    }

    return null;
  } catch (e) {
    console.log('Cannot retrieve keychain data', e);
    return null;
  }
};

const resetGenericPassword = async () => {
  try {
    const reset = await Keychain.resetGenericPassword();
    return reset;
  } catch (e) {
    console.log('cannot access or reset keychain data ', e);
    return false;
  }
};

const setInternetCredentials = async (username: string, password: string) => {
  try {
    await Keychain.setInternetCredentials(SERVER_NAME, username, password, {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    });
  } catch (error) {
    console.log(
      '🚀 ~ file: keychain.js:46 ~ setInternetCredentials ~ error:',
      error,
    );
  }
};

const getInternetCredentials = async () => {
  try {
    const value = await Keychain.getInternetCredentials(
      SERVER_NAME,
      // noBiometricsConfig,
    );
    return value;
  } catch (error) {
    console.log(
      '🚀 ~ file: keychain.js:60 ~ getInternetCredentials ~ error:',
      error,
    );
    return null;
  }
};

const resetInternetCredentials = async () => {
  try {
    const reset = await Keychain.resetInternetCredentials(SERVER_NAME);
    return reset;
  } catch (error) {
    console.log(
      '🚀 ~ file: keychain.js:74 ~ resetInternetCredentials ~ error:',
      error,
    );
    return false;
  }
};

const getSupportedBiometryType = async () => {
  try {
    const biometryType = await Keychain.getSupportedBiometryType();
    dispatch(appActions.setSupportedBiometryType(biometryType));
    return biometryType;
  } catch (error) {}
};

const CustomKeyChain = {
  setGenericPassword,
  getGenericPassword,
  resetGenericPassword,
  setInternetCredentials,
  getInternetCredentials,
  resetInternetCredentials,
  getSupportedBiometryType,
};
export default CustomKeyChain;
