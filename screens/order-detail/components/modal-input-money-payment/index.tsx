import { BottomSheet } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Content } from './content';
import { ModalInputMoneyPaymentProps, ModalInputMoneyPaymentRef } from './type';

export const ModalInputMoneyPayment = forwardRef<
  ModalInputMoneyPaymentRef,
  ModalInputMoneyPaymentProps
>((props, ref) => {
  const { handleDone } = props;
  const normalRef = useRef<BottomSheetModal>(null);

  const [inputAndOption, setOption] = useState<{
    money: string;
    curr: string;
  }>({
    money: '0',
    curr: '',
  });

  useImperativeHandle(
    ref,
    () => ({
      present: (money?: string | undefined, currency?: string | undefined) => {
        setOption({
          money: money!,
          curr: currency!,
        });
        normalRef.current?.present();
      },
    }),
    [],
  );
  const _handleDone = (moneyPayment: string, currencyPayment: string) => {
    normalRef.current?.dismiss();
    handleDone(moneyPayment, currencyPayment);
  };

  return (
    <BottomSheet
      type="normal"
      typeBackDrop="gray"
      ref={normalRef}
      showIndicator={false}
      enablePanDownToClose={false}
      useDynamicSnapPoint={true}
      android_keyboardInputMode="adjustPan"
      enableOverDrag={false}
      t18nTitle="order_detail:plh_input-money">
      <Content handleDone={_handleDone} inputAndOption={inputAndOption} />
    </BottomSheet>
  );
});
