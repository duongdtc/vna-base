import { TypeIdMessage } from '@services/mqtt/constants';
import { useMQTTContext } from '@services/mqtt/provider';
import {
  DataMessagePassive,
  NotificationMQTT,
} from '@services/mqtt/types/client';
import { dispatch } from '@vna-base/utils';
import { useCallback, useEffect } from 'react';

export const useHandleNotificationMQTT = () => {
  const { addFunOnMessage, subscribe, unsubscribe, removeFunOnMessage } =
    useMQTTContext();

  const _onMessageNotification = useCallback((data: DataMessagePassive) => {
    switch (data.TypeId) {
      case TypeIdMessage.Notification:
        dispatch(
          notificationActions.addNew({
            ...(data as DataMessagePassive<NotificationMQTT>).Data,
            IsRead: false,
          } as Notification),
        );
        break;
      case TypeIdMessage.UpdateIsRead:
        dispatch(notificationActions.decreaseUnread(data.Data as string));
        break;
    }
  }, []);

  useEffect(() => {
    addFunOnMessage(_onMessageNotification, '_onMessageNotification');
    return () => {
      removeFunOnMessage('_onMessageNotification');
    };
  }, [
    _onMessageNotification,
    addFunOnMessage,
    unsubscribe,
    subscribe,
    removeFunOnMessage,
  ]);
};
