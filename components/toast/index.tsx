import React from 'react';
import Toast, {
  ToastConfig,
  ToastConfigParams,
  ToastPosition,
} from 'react-native-toast-message';
import { Normal } from './components/normal';
import { NormalProps, ShowToastArgs } from './type';
import { IconTypes } from '@assets/icon';
import { ColorValue } from 'react-native';

export const toastConfig: ToastConfig = {
  normal: (props: ToastConfigParams<NormalProps>) => <Normal {...props} />,
};

const config: Record<
  'normal' | 'error' | 'warning' | 'success',
  {
    type: 'normal';
    position: ToastPosition;
    bottomOffset: number;
    visibilityTime: number;
    color?: ColorValue;
    icon?: IconTypes;
  }
> = {
  normal: {
    type: 'normal',
    position: 'bottom',
    bottomOffset: 108,
    visibilityTime: 2400,
  },
  error: {
    type: 'normal',
    position: 'bottom',
    bottomOffset: 108,
    visibilityTime: 2400,
    color: '#CD211A',
    icon: 'alert_triangle_fill',
  },
  warning: {
    type: 'normal',
    position: 'bottom',
    bottomOffset: 108,
    visibilityTime: 2400,
    color: '#EF8904',
    icon: 'alert_triangle_fill',
  },
  success: {
    type: 'normal',
    position: 'bottom',
    bottomOffset: 108,
    visibilityTime: 2400,
    color: '#0E8C35',
    icon: 'checkmark_fill',
  },
};

export const showToast = (args: ShowToastArgs) => {
  const { type, onPress, visibilityTime, ...props } = args;

  const cf = {
    ...config[type],
    onPress,
    props: {
      color: config[type].color,
      icon: config[type].icon,
      ...props,
    },
  };
  if (visibilityTime !== undefined) {
    cf.visibilityTime = visibilityTime;
  }

  Toast.show(cf);
};

export const hideToast = () => {
  Toast.hide();
};
