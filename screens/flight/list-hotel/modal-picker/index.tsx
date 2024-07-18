import { BottomSheet } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Content } from './content';
import { ModalPickerProps, ModalPickerRef } from './type';
import { SnapPoint } from '@vna-base/utils';
import { RoomEnum } from '../dummy';

export const ModalPicker = forwardRef<ModalPickerRef, ModalPickerProps>(
  (props, ref) => {
    const {
      data,
      handleDone,
      t18nTitle,
      showCloseButton = true,
      showIndicator = false,
      snapPoints = [SnapPoint.Half],
    } = props;
    const normalRef = useRef<BottomSheetModal>(null);
    const [selectedStatusKey, setSelectedStatusKey] = useState<
      RoomEnum | undefined
    >();

    useImperativeHandle(
      ref,
      () => ({
        present: selectedId => {
          setSelectedStatusKey(selectedId);
          normalRef.current?.present();
        },
      }),
      [],
    );
    const _handleDone = (statusKey: RoomEnum) => {
      normalRef.current?.dismiss();
      handleDone(statusKey);
    };

    return (
      <BottomSheet
        ref={normalRef}
        type="normal"
        dismissWhenClose={true}
        typeBackDrop="gray"
        useDynamicSnapPoint={false}
        snapPoints={snapPoints}
        showIndicator={showIndicator}
        showCloseButton={showCloseButton}
        showLineBottomHeader={showCloseButton ? true : false}
        enablePanDownToClose={false}
        enableOverDrag={false}
        t18nTitle={t18nTitle}>
        <Content
          data={data}
          selectedStatusKey={selectedStatusKey!}
          handleDone={_handleDone}
        />
      </BottomSheet>
    );
  },
);
