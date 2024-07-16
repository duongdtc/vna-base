/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheet } from '@vna-base/components';
import { CommonProps } from '@vna-base/components/bottom-sheet/type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { selectSession } from '@redux-selector';
import {
  AirOptionCustom,
  BottomSheetFareOptionRef,
  FareFilter,
} from '@vna-base/screens/flight/type';
import { Spacing } from '@theme/type';
import { WindowHeight } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';
import { ListFareOption } from './list-fare-option';

type Props = Pick<CommonProps, 'useModal' | 'paddingBottom'> & {
  maxHeight?: number;
};

export const paddingLeftContentModal: Spacing = 12;

export const BottomSheetFareOption = memo(
  forwardRef<BottomSheetFareOptionRef, Props>((props, ref) => {
    const {
      onSelectFare,
      hideListFare = false,
      useModal,
      paddingBottom,
      maxHeight = WindowHeight / 1.2,
    } = props;

    const sessions = useSelector(selectSession);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const [type, setType] = useState<'economy' | 'business'>('economy');
    const [fareType, setFareType] = useState<{
      fareType?: keyof FareFilter;
      customFeeTotalType?: 'Total' | 'TotalFare' | 'BaseFare' | 'PriceAdt';
    }>();

    const [dataSelected, setDataSelected] = useState<AirOptionCustom>({});

    const indexs = useRef({
      stageIndex: 0,
      flightOptionIndex: 0,
    });

    useImperativeHandle(ref, () => ({
      expand: async data => {
        if (!isEmpty(data)) {
          if (!isEmpty(data.indexs)) {
            indexs.current = data.indexs;
          }

          setFareType({
            fareType: data.fareType,
            customFeeTotalType: data.customFeeTotalType,
          });

          setDataSelected(data.airOption);

          setType(data.type);
        }

        bottomSheetRef.current?.expand();
      },
      present: async data => {
        if (!isEmpty(data)) {
          if (!isEmpty(data.indexs)) {
            indexs.current = data.indexs;
          }

          setFareType({
            fareType: data.fareType,
            customFeeTotalType: data.customFeeTotalType,
          });
          setDataSelected(data.airOption);

          setType(data.type);
        }

        bottomSheetRef.current?.present();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const selectFare = useCallback(
      (fareOptionIdx: number) => {
        onSelectFare?.(
          dataSelected,
          indexs.current.flightOptionIndex,
          fareOptionIdx,
        );
      },
      [dataSelected, onSelectFare],
    );

    return (
      <BottomSheet
        paddingBottom={paddingBottom}
        useModal={useModal}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
        typeBackDrop="gray"
        type="normal"
        t18nTitle={
          type === 'business' ? 'Khoang thương gia' : 'Khoang phổ thông'
        }
        showIndicator={false}>
        <ListFareOption
          type={type}
          selected={dataSelected.selected}
          dataFareOptions={dataSelected.ListFareOption}
          ticketInfo={{
            AirlineOptionId: dataSelected.OptionId!,
            FlightOptionId:
              dataSelected.ListFlightOption?.[indexs.current.flightOptionIndex]
                ?.OptionId!,
            Session: sessions[dataSelected.System],
            System: dataSelected.System as System,
            Itinerary: dataSelected.Itinerary ?? 1,
            verifySession: dataSelected.verifySession,
          }}
          selectFare={selectFare}
          fareType={fareType}
        />
      </BottomSheet>
    );
  }),
  isEqual,
);
