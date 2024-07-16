import {
  ActionSheet,
  Block,
  Button,
  Icon,
  NormalHeader,
  Text,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { goBack } from '@navigation/navigation-service';
import { selectAccount, selectCurrentAccount } from '@redux-selector';
import { orderActions } from '@redux-slice';
import { FormOrderDetailType, listOption } from '@vna-base/screens/order-detail/type';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { useObject } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import { dispatch } from '@vna-base/utils';
import React, { memo, useMemo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';

type Props = {
  id: string;
  onChooseMonitor: () => void;
  onPressHistory: () => void;
};

export const Header = memo(({ onChooseMonitor, id, onPressHistory }: Props) => {
  const orderDetail = useObject<OrderRealm>(OrderRealm.schema.name, id);
  const actionSheetRef = useRef<ActionSheet>(null);

  const { control, handleSubmit } = useFormContext<FormOrderDetailType>();
  const monitorId = useWatch({
    control,
    name: 'MonitorBy',
  });

  const accountSelected = useSelector(selectAccount(monitorId!));
  const currentAccount = useSelector(selectCurrentAccount);

  const { isDirty, dirtyFields } = useFormState<FormOrderDetailType>({
    control,
  });

  const _save = () => {
    handleSubmit(formData => {
      const paidAmt = Number(
        formData.FormPaymentTab?.PaidAmt?.replaceAll(',', ''),
      );
      dispatch(
        orderActions.updateOrderDetail(
          {
            ...formData,
            FormPaymentTab: {
              ...formData.FormPaymentTab,
              PaidAmt: paidAmt.toString(),
            },
          },
          dirtyFields,
        ),
      );
    })();
  };

  // const _onDelete = () => {
  //   dispatch(
  //     orderActions.deleteOrder(order.Id!, () => {
  //       navigate(APP_SCREEN.ORDER);
  //     }),
  //   );
  // };

  const onPressOption = (item: OptionData) => {
    if (item.key === 'VIEW_HISTORY') {
      onPressHistory();
      return;
    }

    // if (item.key === 'DELETE_ORDER') {
    //   showModalConfirm({
    //     t18nTitle: 'order:delete_order',
    //     t18nSubtitle: 'order:sub_delete_order',
    //     t18nCancel: 'common:cancel',
    //     t18nOk: 'common:delete',
    //     themeColorCancel: 'neutral50',
    //     themeColorTextCancel: 'neutral900',
    //     themeColorOK: 'error500',
    //     onOk: _onDelete,
    //     flexDirection: 'row',
    //   });
    //   return;
    // }
  };

  const _leftContent = useMemo(
    () => (
      <Block flexDirection="row" alignItems="center" columnGap={8}>
        <Button
          type="common"
          size="small"
          leftIcon="arrow_ios_left_outline"
          textColorTheme="neutral900"
          leftIconSize={24}
          padding={4}
          onPress={() => {
            goBack();
          }}
        />
        <Pressable
          onPress={onChooseMonitor}
          disabled={orderDetail?.AgentId !== currentAccount?.AgentId}>
          <Block
            flexDirection="row"
            alignItems="center"
            columnGap={4}
            rowGap={2}>
            <Text
              text={`${translate('order_detail:order')}: `}
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
            <Text
              text={orderDetail?.Index?.toString()}
              fontStyle="Title20Semi"
              colorTheme="neutral900"
            />
          </Block>
          {orderDetail?.AgentId === currentAccount?.AgentId && (
            <Block flexDirection="row" alignItems="center" columnGap={2}>
              <Text
                text={
                  accountSelected?.FullName ??
                  translate('order_detail:choose_monitor')
                }
                fontStyle="Capture11Reg"
                colorTheme="primary500"
              />
              <Icon icon="edit_2_fill" colorTheme="primary500" size={11} />
            </Block>
          )}
        </Pressable>
      </Block>
    ),
    [monitorId, onChooseMonitor],
  );

  const _rightContent = () => (
    <Block flexDirection="row" alignItems="center" columnGap={8}>
      {isDirty && (
        <Button
          type="common"
          size="small"
          leftIcon="saver_outline"
          textColorTheme="neutral900"
          leftIconSize={24}
          padding={4}
          onPress={_save}
        />
      )}
      <Button
        type="common"
        size="small"
        leftIcon="more_vertical_outline"
        textColorTheme="neutral900"
        leftIconSize={24}
        padding={4}
        onPress={() => {
          actionSheetRef.current?.show();
        }}
      />
      <ActionSheet
        type="select"
        typeBackDrop="gray"
        ref={actionSheetRef}
        onPressOption={onPressOption}
        option={listOption}
      />
    </Block>
  );

  return (
    <NormalHeader
      zIndex={0}
      colorTheme="neutral100"
      leftContent={_leftContent}
      rightContent={_rightContent()}
    />
  );
}, isEqual);
