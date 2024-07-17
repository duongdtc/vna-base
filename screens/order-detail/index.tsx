import {
  BottomSheetHistory,
  BottomSheetHistoryRef,
  ModalUserAccountPicker,
  Screen,
} from '@vna-base/components';
import { ModalUserAccountPickerRef } from '@vna-base/components/modal-user-account-picker/type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderActions } from '@vna-base/redux/action-slice';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { useObject } from '@services/realm/provider';
import {
  dispatch,
  ObjectHistoryTypes,
  OrderStatusDetails,
  SnapPoint,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import {
  Header,
  ModalCustomPicker,
  TabOrderContents,
  TopInfoOrder,
} from './components';
import { ModalCustomPickerRef } from './components/modal-custom-picker/type';
import { FormOrderDetailType } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const OrderDetail = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.ORDER_DETAIL>) => {
  const { id } = route.params;

  const actionSheetStatusOrderRef = useRef<ModalCustomPickerRef>(null);
  const modalUserAccountRef = useRef<ModalUserAccountPickerRef>(null);
  const BTSHistoryRef = useRef<BottomSheetHistoryRef>(null);

  const orderDetail = useObject<OrderRealm>(OrderRealm.schema.name, id);

  const formMethod = useForm<FormOrderDetailType>({
    mode: 'all',
  });

  useEffect(() => {
    if (!isEmpty(orderDetail)) {
      formMethod.reset(
        {
          MonitorBy: orderDetail.MonitorBy ?? '',
          OrderStatus: orderDetail.OrderStatus ?? 'NEW',
          FormNote: {
            comment: '',
          },
          FormPaymentTab: {
            PaymentStatus: orderDetail.PaymentStatus?.toString(),
            PaymentMethod: null,
            PaymentGateway: null,
            PaymentDate: null,
            PaymentExpiry:
              orderDetail.PaymentExpiry !== null
                ? dayjs(orderDetail.PaymentExpiry).toDate()
                : null,
            PaidAmt: orderDetail.PaidAmt?.currencyFormat(),
            PaidCur: orderDetail.PaidCur ?? null,
          },
          FormOrder: {
            Language: orderDetail.Language?.toString(),
            IPAddress: orderDetail.IPAddress?.toString(),
            CurrencyRate: orderDetail.CurrencyRate?.toString(),
            EquivCurrency: orderDetail.Currency?.toString(),
            Currency: orderDetail.EquivCurrency?.toString(),
          },
          FormContact: {
            ContactTitle: orderDetail.ContactTitle ?? null,
            ContactName: orderDetail.ContactName ?? '',
            ContactPhone: orderDetail.ContactPhone?.toString() ?? '',
            ContactEmail: orderDetail.ContactEmail?.toString() ?? '',
            ContactAddress: orderDetail.ContactAddress?.toString() ?? '',
            ContactRemark: orderDetail.ContactRemark ?? null,
          },
        },
        { keepDirty: false },
      );
    }
  }, [formMethod, orderDetail]);

  useEffect(() => {
    dispatch(orderActions.getOrderDetail(id));

    return () => {
      dispatch(orderActions.saveViewingOrderId(null));
    };
  }, [id]);

  useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    AvoidSoftInput.setEnabled(true);
    AvoidSoftInput.setAvoidOffset(0);

    return () => {
      AvoidSoftInput.setAvoidOffset(0);
      AvoidSoftInput.setEnabled(false);
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
    };
  }, []);

  const onChangeStatusOrder = (val: string | null) => {
    formMethod.setValue('OrderStatus', val, {
      shouldDirty: true,
    });
  };

  const onChangeMonitor = (val: string | null) => {
    formMethod.setValue('MonitorBy', val, {
      shouldDirty: true,
    });
  };

  return (
    <Screen unsafe backgroundColor="neutral100">
      <FormProvider {...formMethod}>
        <Header
          id={id}
          onChooseMonitor={() =>
            modalUserAccountRef.current?.present(
              formMethod.getValues('MonitorBy'),
            )
          }
          onPressHistory={() => {
            BTSHistoryRef.current?.present({
              ObjectId: orderDetail?.Id,
              ObjectType: ObjectHistoryTypes.ORDER,
            });
          }}
        />
        <TopInfoOrder
          id={id}
          onShowStatusOption={() =>
            actionSheetStatusOrderRef.current?.present(
              formMethod.getValues('OrderStatus'),
            )
          }
        />
        <TabOrderContents id={id} />
      </FormProvider>

      <ModalCustomPicker
        ref={actionSheetStatusOrderRef}
        data={Object.values(OrderStatusDetails)}
        snapPoints={[SnapPoint['40%']]}
        t18nTitle="order_detail:choose_status"
        handleDone={onChangeStatusOrder}
      />
      <ModalUserAccountPicker
        ref={modalUserAccountRef}
        t18nTitle="order_detail:choose_monitor"
        handleDone={onChangeMonitor}
      />
      <BottomSheetHistory ref={BTSHistoryRef} isOrderHistory />
    </Screen>
  );
};
