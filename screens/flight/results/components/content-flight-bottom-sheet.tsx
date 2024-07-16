/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheet } from '@vna-base/components';
import { CommonProps } from '@vna-base/components/bottom-sheet/type';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectSearchForm } from '@redux-selector';
import {
  AirOptionCustom,
  BottomSheetContentFlightRef,
} from '@vna-base/screens/flight/type';
import { useStyles } from '@theme';
import { Spacing } from '@theme/type';
import { WindowHeight } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { ListSegmentInfo } from './list-segment-info';
import { RenderContentTabMultiStage } from './tab-multistage-content-segment';
import { RenderContentTabRoundTrip } from './tab-roundtrip-content-segment';

type Props = Pick<CommonProps, 'useModal' | 'paddingBottom'> & {
  maxHeight?: number;
};

export const paddingLeftContentModal: Spacing = 12;

export const BottomSheetContentFlight = memo(
  forwardRef<BottomSheetContentFlightRef, Props>((props, ref) => {
    const { useModal, paddingBottom, maxHeight = WindowHeight / 1.2 } = props;

    const {
      theme: { colors },
    } = useStyles();

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const { Type } = useSelector(selectSearchForm);

    const [dataSelected, setDataSelected] = useState<AirOptionCustom>({});

    const indexs = useRef({
      stageIndex: 0,
      flightOptionIndex: 0,
    });

    /**
     * 48 laf title height
     * 208 là chiều cao ListFareOption
     */
    const _maxHeight = useMemo(() => maxHeight - 48 - 208, [maxHeight]);

    const checkHasStop = useMemo(() => {
      return dataSelected.ListFlightOption?.[0].ListFlight?.some(
        obj => obj.ListSegment?.length! > 1,
      );
    }, [dataSelected.ListFlightOption]);

    useImperativeHandle(ref, () => ({
      expand: async data => {
        if (!isEmpty(data)) {
          if (!isEmpty(data.indexs)) {
            indexs.current = data.indexs;
          }

          setDataSelected(data.airOption);
        }

        bottomSheetRef.current?.expand();
      },
      present: async data => {
        if (!isEmpty(data)) {
          if (!isEmpty(data.indexs)) {
            indexs.current = data.indexs;
          }

          setDataSelected(data.airOption);
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

    const _renderContentTabSegment = useMemo(() => {
      if ((dataSelected.Itinerary ?? 1) > 1 && Type === 'MultiStage') {
        return <RenderContentTabMultiStage dataSelected={dataSelected} />;
      }

      if ((dataSelected.Itinerary ?? 1) > 1 && Type === 'RoundStage') {
        return <RenderContentTabRoundTrip dataSelected={dataSelected} />;
      }
    }, [Type, dataSelected]);

    return (
      <BottomSheet
        paddingBottom={paddingBottom}
        useModal={useModal}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
        typeBackDrop="gray"
        type="normal"
        t18nTitle="flight:detail_flight"
        showIndicator={false}>
        {(dataSelected.Itinerary ?? 1) === 1 ? (
          <BottomSheetScrollView
            nestedScrollEnabled
            scrollEnabled
            style={{ flex: 1, maxHeight: _maxHeight }}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: colors.neutral10,
                padding: paddingLeftContentModal,
              }}>
              <ListSegmentInfo
                listSegments={
                  dataSelected.ListFlightOption?.[0].ListFlight![0].ListSegment
                }
              />
            </View>
          </BottomSheetScrollView>
        ) : (
          <View
            style={{
              height: checkHasStop ? _maxHeight : WindowHeight / 3,
            }}>
            {_renderContentTabSegment}
          </View>
        )}
      </BottomSheet>
    );
  }),
  isEqual,
);
