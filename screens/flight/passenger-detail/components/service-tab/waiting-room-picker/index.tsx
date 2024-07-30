/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheet } from '@vna-base/components';
import { SnapPoint } from '@vna-base/utils';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import {
  WaitingRoom,
  WaitingRoomPickerProps,
  WaitingRoomPickerRef,
} from '@vna-base/screens/flight/type';
import { Content } from './content';

export const WaitingRoomPicker = forwardRef<
  WaitingRoomPickerRef,
  WaitingRoomPickerProps
>(({ onDone }, ref) => {
  const normalRef = useRef<BottomSheetModal>(null);

  const [state, setState] = useState<{
    selected: string | null | undefined;
    flightIndex: number;
  }>();

  useImperativeHandle(
    ref,
    () => ({
      present: ({ selected, flightIndex }) => {
        setState({
          selected,
          flightIndex,
        });

        normalRef.current?.present();
      },
    }),
    [],
  );

  const _handleDone = (waitingRoom: WaitingRoom) => {
    normalRef.current?.dismiss();
    onDone({
      waitingRoom,
      flightIndex: state?.flightIndex!,
    });
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
      snapPoints={[SnapPoint['30%']]}
      t18nTitle="Chọn phòng chờ">
      <Content
        selectedBaggage={state?.selected}
        onDone={_handleDone}
        flightIndex={state?.flightIndex!}
      />
    </BottomSheet>
  );
});
