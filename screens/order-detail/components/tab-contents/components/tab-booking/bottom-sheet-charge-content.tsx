/* eslint-disable react/no-unstable-nested-components */
import { BottomSheet, Separator, Text } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { selectCharges, selectViewingOrderId } from '@vna-base/redux/selector';
import { chargeActions } from '@vna-base/redux/action-slice';
import { Charge } from '@services/axios/axios-data';
import { dispatch, SnapPoint } from '@vna-base/utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { ListRenderItem, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemCharge } from './item-charge';
import { useStyles } from './style';

export type BottomSheetChargeRef = {
  present: () => void;
};

export const BottomSheetChargeContent = forwardRef<BottomSheetChargeRef, any>(
  (_, ref) => {
    const styles = useStyles();

    const normalRef = useRef<NormalRef>(null);
    // const feeModalRef = useRef<ModalFeeRef>(null);

    const viewingOrderId = useSelector(selectViewingOrderId);
    const charges = useSelector(selectCharges);

    const pullToRefresh = () => {
      dispatch(chargeActions.getChargesByOrderId(viewingOrderId as string));
    };

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          normalRef.current?.present();
        },
      }),
      [],
    );

    // const onShowConfirmDelete = useCallback((chargeId: number) => {
    //   showModalConfirm({
    //     flexDirection: 'row',
    //     t18nTitle: 'order_detail:delete_data',
    //     t18nSubtitle: 'order_detail:sub_delete_data',
    //     t18nCancel: 'common:cancel',
    //     t18nOk: 'common:delete',
    //     themeColorCancel: 'neutral50',
    //     themeColorTextCancel: 'neutral900',
    //     themeColorOK: 'error500',
    //     onOk: () =>
    //       dispatch(
    //         chargeActions.deleteFlightCharge(chargeId, () => {
    //           // dispatch(chargeActions.getChargesByOrderId(order.Id!));
    //         }),
    //       ),
    //   });
    // }, []);

    const renderItemCharges = useCallback<ListRenderItem<Charge>>(
      ({ item: flightCharge }) => {
        return (
          <ItemCharge
            flightCharge={flightCharge}
            // modalFeeRef={feeModalRef}
            // onDelete={() => onShowConfirmDelete(Number(flightCharge.Id))}
          />
        );
      },
      [],
    );

    // const canAddFee = useMemo(
    //   () => can('INSERT', 'BOOKING_FARE', { AgentCode: order.AgentCode }),
    //   [order.AgentCode],
    // );

    return (
      <>
        <BottomSheet
          ref={normalRef}
          type="normal"
          dismissWhenClose={true}
          typeBackDrop="gray"
          useDynamicSnapPoint={false}
          snapPoints={[SnapPoint.Half]}
          enablePanDownToClose={false}
          showCloseButton
          t18nTitle="flight:fare"
          // t18nDone={canAddFee ? 'common:add_more_fee' : undefined}
          // onDone={() => {
          //   feeModalRef.current?.show(undefined);
          // }}
          showIndicator={false}>
          <BottomSheetFlatList
            data={charges}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={pullToRefresh} />
            }
            ListEmptyComponent={
              <Text
                fontStyle="Body14Reg"
                textAlign="center"
                colorTheme="neutral900"
                t18n="common:not_found_result"
              />
            }
            style={styles.containerMoreOption}
            ItemSeparatorComponent={() => (
              <Separator
                type="horizontal"
                paddingVertical={12}
                paddingHorizontal={16}
              />
            )}
            keyExtractor={(i, index) => `${i.Id}_${index}`}
            renderItem={renderItemCharges}
            contentContainerStyle={styles.contentContainerMoreOption}
          />
        </BottomSheet>
        {/* <ModalFee ref={feeModalRef} /> */}
      </>
    );
  },
);
