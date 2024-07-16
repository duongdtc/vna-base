/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheet } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ancillary } from '@services/axios/axios-ibe';
import { SnapPoint } from '@vna-base/utils';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ModalBaggagePickerRef } from '../../type';
import { Content } from './content';

type ModalBaggagePickerProps = {
  onDone: (data: {
    baggage: Ancillary;
    passengerIndex: number;
    flightIndex: number;
  }) => void;
};

export const ModalBaggagePicker = forwardRef<
  ModalBaggagePickerRef,
  ModalBaggagePickerProps
>(({ onDone }, ref) => {
  const normalRef = useRef<BottomSheetModal>(null);

  const [state, setState] = useState<{
    selected: string | null | undefined;
    passengerIndex: number;
    flightIndex: number;
  }>();

  useImperativeHandle(
    ref,
    () => ({
      present: ({
        selected,
        passengerIndex,
        flightIndex,
      }: {
        selected: string | null | undefined;
        passengerIndex: number;
        flightIndex: number;
      }) => {
        setState({
          selected,
          passengerIndex,
          flightIndex,
        });

        normalRef.current?.present();
      },
    }),
    [],
  );

  const _handleDone = (baggage: Ancillary) => {
    normalRef.current?.dismiss();
    onDone({
      baggage,
      passengerIndex: state?.passengerIndex!,
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
      snapPoints={[SnapPoint.Half]}
      t18nTitle="input_info_passenger:select_baggage">
      <Content
        selectedBaggage={state?.selected}
        onDone={_handleDone}
        flightIndex={state?.flightIndex!}
      />
    </BottomSheet>
  );
});
