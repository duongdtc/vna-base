/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheet } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Flight } from '@services/axios/axios-data';
import { Ancillary } from '@services/axios/axios-ibe';
import { SnapPoint } from '@vna-base/utils';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ModalServicePickerRef } from '../../type';
import { Content, ContentRef } from './content';

type ModalServicePickerProps = {
  onDone: (data: {
    services: Array<Ancillary>;
    passengerIndex: number;
    flightIndex: number;
    segmentIndex: number;
  }) => void;
};

export const ModalServicePicker = forwardRef<
  ModalServicePickerRef,
  ModalServicePickerProps
>(({ onDone }, ref) => {
  const normalRef = useRef<BottomSheetModal>(null);
  const contentRef = useRef<ContentRef>(null);

  const [state, setState] = useState<{
    listSelected: Array<string> | null | undefined;
    passengerIndex: number;
    flight: Flight & { index: number };
    segmentIndex: number;
  }>();

  useImperativeHandle(
    ref,
    () => ({
      present: ({
        listSelected,
        passengerIndex,
        flight,
        segmentIndex,
      }: {
        listSelected: Array<string> | null | undefined;
        passengerIndex: number;
        flight: Flight & { index: number };
        segmentIndex: number;
      }) => {
        setState({
          listSelected,
          flight,
          passengerIndex,
          segmentIndex,
        });
        normalRef.current?.present();
      },
    }),
    [],
  );

  const _handleDone = (services: Array<Ancillary>) => {
    normalRef.current?.dismiss();
    onDone({
      services,
      passengerIndex: state?.passengerIndex!,
      flightIndex: state?.flight.index!,
      segmentIndex: state?.segmentIndex!,
    });
  };

  const onPressBackDrop = () => {
    contentRef.current?.submit();
  };

  return (
    <BottomSheet
      type="normal"
      typeBackDrop="gray"
      ref={normalRef}
      showIndicator={false}
      onPressBackDrop={onPressBackDrop}
      enablePanDownToClose={false}
      useDynamicSnapPoint={false}
      enableOverDrag={false}
      snapPoints={[SnapPoint.Half]}
      t18nTitle="input_info_passenger:select_service">
      <Content
        ref={contentRef}
        selectedServices={state?.listSelected}
        onDone={_handleDone}
        flight={state?.flight!}
      />
    </BottomSheet>
  );
});
