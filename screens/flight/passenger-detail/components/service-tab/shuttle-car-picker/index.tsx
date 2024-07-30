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
  ShuttleCar,
  ShuttleCarPickerProps,
  ShuttleCarPickerRef,
} from '@vna-base/screens/flight/type';
import { Content } from './content';

export const ShuttleCarPicker = forwardRef<
  ShuttleCarPickerRef,
  ShuttleCarPickerProps
>(({ onDone }, ref) => {
  const normalRef = useRef<BottomSheetModal>(null);

  const [state, setState] = useState<{
    selected: string | null | undefined;
    flightIndex: number;
    airportIdx: number;
  }>();

  useImperativeHandle(
    ref,
    () => ({
      present: ({ selected, flightIndex, airportIdx }) => {
        setState({
          selected,
          flightIndex,
          airportIdx,
        });

        normalRef.current?.present();
      },
    }),
    [],
  );

  const _handleDone = (shuttleCar: ShuttleCar) => {
    normalRef.current?.dismiss();
    onDone({
      shuttleCar,
      flightIndex: state?.flightIndex!,
      airportIdx: state?.airportIdx!,
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
      snapPoints={[SnapPoint['40%']]}
      t18nTitle="Chọn xe đưa đón">
      <Content
        selectedBaggage={state?.selected}
        onDone={_handleDone}
        flightIndex={state?.flightIndex!}
        airportIdx={state?.airportIdx!}
      />
    </BottomSheet>
  );
});
