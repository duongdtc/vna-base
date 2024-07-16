/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheet, LazyPlaceholder, Separator, Text } from '@components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {
  selectIsLoadingListHistory,
  selectListHistory,
  selectListOrderActivity,
} from '@redux-selector';
import { History } from '@services/axios/axios-data';
import { SnapPoint, dispatch } from '@utils';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import isEqual from 'react-fast-compare';
import { ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';

import { NormalRef } from '@components/bottom-sheet/type';
import { historyActions, orderActions } from '@redux-slice';
import { ItemHistory } from './item-history';
import { useStyles } from './style';
import isEmpty from 'lodash.isempty';

export type BottomSheetHistoryRef = {
  present: (args: Pick<History, 'ObjectId' | 'ObjectType'>) => void;
};

export type BottomSheetHistoryProps = {
  /**
   *  !isOrderHistory là để xem lịch sử của:
   *  booking, agent-detail,
   *  config-email, config-ticket,
   *  personal-info, policy-detail
   */
  isOrderHistory?: boolean;
};

export const BottomSheetHistory = memo(
  forwardRef<BottomSheetHistoryRef, BottomSheetHistoryProps>((props, ref) => {
    const styles = useStyles();

    const BTSRef = useRef<NormalRef>(null);
    const { isOrderHistory = false } = props;
    const { List } = useSelector(selectListHistory);
    const { List: ListOrderHistory } = useSelector(selectListOrderActivity);

    const isShowBookingInfo = useMemo(() => {
      if (!isEmpty(List)) {
        return List![0].ObjectType === 'Booking';
      }

      return false;
    }, [List]);

    const isLoading = useSelector(selectIsLoadingListHistory);

    const renderItemHistory = useCallback<ListRenderItem<History>>(
      ({ item }) => {
        return (
          <ItemHistory
            item={item}
            disabled={item.ActionCode === 'CREATE'}
            isShowBookingInfo={isShowBookingInfo! || isOrderHistory}
          />
        );
      },
      [isOrderHistory, isShowBookingInfo],
    );

    useImperativeHandle(
      ref,
      () => ({
        present: args => {
          if (isOrderHistory) {
            dispatch(orderActions.getActivityByOrderId(args.ObjectId!));
          } else {
            dispatch(historyActions.getListHistory(args));
          }

          BTSRef.current?.expand();
        },
      }),
      [isOrderHistory],
    );

    return (
      <BottomSheet
        ref={BTSRef}
        type="normal"
        useModal={false}
        dismissWhenClose={true}
        typeBackDrop="gray"
        useDynamicSnapPoint={false}
        showCloseButton={false}
        snapPoints={[SnapPoint.Half]}
        showIndicator={true}>
        <BottomSheetFlatList
          data={isOrderHistory ? ListOrderHistory : List}
          ListEmptyComponent={
            isLoading ? (
              <LazyPlaceholder />
            ) : (
              <Text
                fontStyle="Body14Reg"
                textAlign="center"
                colorTheme="neutral900"
                t18n="common:not_found_result"
              />
            )
          }
          style={styles.containerMoreOption}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => (
            <Separator
              type="horizontal"
              paddingVertical={12}
              paddingHorizontal={16}
            />
          )}
          keyExtractor={(i, index) => `${i.Id}_${index}`}
          renderItem={renderItemHistory}
          contentContainerStyle={styles.contentContainerMoreOption}
        />
      </BottomSheet>
    );
  }),
  isEqual,
);
