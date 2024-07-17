import { replace } from '@navigation/navigation-service';
import { bankActions } from '@vna-base/redux/action-slice';
import { selectQR } from '@redux/selector/bank';
import { TypeIdMessage } from '@services/mqtt/constants';
import { useMQTTContext } from '@services/mqtt/provider';
import { APP_SCREEN } from '@utils';
import { dispatch, getState } from '@vna-base/utils';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export enum TransactionStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

type Data = {
  Id: string;
  RefNumb: string;
};

export const useHandleTopupMQTT = () => {
  const { addFunOnMessage, connected } = useMQTTContext();
  const { randomCode } = useSelector(selectQR);

  const _handleMessage = ({
    status,
    Id,
    RefNumb,
  }: Data & { status: TransactionStatus }) => {
    if (RefNumb !== randomCode) {
      console.log(`[LOG-MQTT] Không phải giao dịch ${randomCode}`);
      return;
    }

    const oldTransactionStatus = getState('bank').transactionStatus;
    if (status !== oldTransactionStatus) {
      dispatch(bankActions.saveTransactionStatus(status));
    }

    if (!oldTransactionStatus) {
      replace(APP_SCREEN.TOPUP_DETAIL, { id: Id, realtime: true });
    }
  };

  const _onMessageQRFailed = (data: Data) => {
    _handleMessage({
      status: TransactionStatus.FAILED,
      ...data,
    });
  };

  const _onMessageTopupFailed = (data: Data) => {
    _handleMessage({
      status: TransactionStatus.FAILED,
      ...data,
    });
  };

  const _onMessageTopupProcessing = (data: Data) => {
    _handleMessage({
      status: TransactionStatus.PROCESSING,
      ...data,
    });
  };

  const _onMessageTopupSuccess = (data: Data) => {
    _handleMessage({
      status: TransactionStatus.SUCCESS,
      ...data,
    });
  };

  useEffect(() => {
    if (connected) {
      addFunOnMessage(TypeIdMessage.QRFailed, _onMessageQRFailed);
      addFunOnMessage(TypeIdMessage.TopupFailed, _onMessageTopupFailed);
      addFunOnMessage(TypeIdMessage.TopupProcessing, _onMessageTopupProcessing);
      addFunOnMessage(TypeIdMessage.TopupSuccess, _onMessageTopupSuccess);
    }
  }, []);
};
