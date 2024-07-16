import { BottomSheet } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { SnapPoint } from '@utils';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Content } from './content';
import { ModalUserAccountPickerRef, ModalUserAccountPickerProps } from './type';

export const ModalUserAccountPicker = forwardRef<
  ModalUserAccountPickerRef,
  ModalUserAccountPickerProps
>((props, ref) => {
  const { handleDone, t18nTitle } = props;
  const normalRef = useRef<BottomSheetModal>(null);

  const [selectedAccountId, setSelectedAccountId] = useState<
    string | null | undefined
  >();

  useImperativeHandle(
    ref,
    () => ({
      present: (selectedId?: string | null | undefined) => {
        setSelectedAccountId(selectedId);
        normalRef.current?.present();
      },
    }),
    [],
  );
  const _handleDone = (accountId: string) => {
    normalRef.current?.dismiss();
    handleDone(accountId);
  };

  return (
    <BottomSheet
      type="normal"
      typeBackDrop="gray"
      ref={normalRef}
      showIndicator={false}
      enablePanDownToClose={false}
      useDynamicSnapPoint={false}
      enableOverDrag={false}
      snapPoints={[SnapPoint.Half]}
      t18nTitle={t18nTitle}>
      <Content selectedAccountId={selectedAccountId} handleDone={_handleDone} />
    </BottomSheet>
  );
});
