/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Ancillary } from '@services/axios/axios-ibe';
import { Content, ContentRef } from './content';
import { FlightOfPassengerForm } from '@vna-base/screens/flight/type';
import { BottomSheet } from '@vna-base/components';
import { SnapPoint } from '@vna-base/utils';
import {
  ModalShuttleCarPickerProps,
  ModalShuttleCarPickerRef,
} from '../../../type';

export const ModalShuttleCarPicker = forwardRef<
  ModalShuttleCarPickerRef,
  ModalShuttleCarPickerProps
>(({ onDone }, ref) => {
  const normalRef = useRef<BottomSheetModal>(null);
  const contentRef = useRef<ContentRef>(null);

  const [state, setState] = useState<{
    listSelected: Array<string> | null | undefined;
    passengerIndex: number;
    flight: FlightOfPassengerForm & { index: number };
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
        flight: FlightOfPassengerForm & { index: number };
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
