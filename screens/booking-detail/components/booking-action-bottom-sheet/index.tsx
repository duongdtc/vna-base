import { BottomSheet } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  FlightActionBottomSheetRef,
  FlightActionExpandParams,
} from '@vna-base/screens/booking-detail/type';
import { SnapPoint } from '@vna-base/utils';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import { Content } from './content';

export const FlightActionBottomSheet = memo(
  forwardRef<FlightActionBottomSheetRef, any>((_, ref) => {
    const bottomSheetRef = useRef<NormalRef>(null);

    const [data, setData] = useState<
      Omit<FlightActionExpandParams, 'closeBottomSheet'>
    >({} as Omit<FlightActionExpandParams, 'closeBottomSheet'>);

    useImperativeHandle(
      ref,
      () => ({
        present: args => {
          setData(args);
          bottomSheetRef.current?.present();
        },
      }),
      [],
    );

    const closeBottomSheet = useCallback(() => {
      bottomSheetRef.current?.dismiss();
    }, []);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        useDynamicSnapPoint={false}
        snapPoints={[SnapPoint.Half]}
        type="normal"
        showIndicator={false}
        t18nTitle="order_detail:operation"
        enablePanDownToClose={false}
        showLineBottomHeader>
        <Content {...data} closeBottomSheet={closeBottomSheet} />
      </BottomSheet>
    );
  }),
  isEqual,
);
