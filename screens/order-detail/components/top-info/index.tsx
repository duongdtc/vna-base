/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Icon, Text, TouchableScale } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectCurrentAccount } from '@vna-base/redux/selector';
import { FormOrderDetailType } from '@vna-base/screens/order-detail/type';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { useObject } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  OrderStatus,
  OrderStatusDetails,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '@utils';

type Props = {
  id: string;
  onShowStatusOption: () => void;
};

export const TopInfoOrder = ({ onShowStatusOption, id }: Props) => {
  const orderDetail = useObject<OrderRealm>(OrderRealm.schema.name, id);
  const { control } = useFormContext<FormOrderDetailType>();
  const currentAccount = useSelector(selectCurrentAccount);

  const statusOrder = useWatch({
    control,
    name: 'OrderStatus',
  });

  const status = OrderStatusDetails[statusOrder as OrderStatus];

  return (
    <Block paddingTop={8} colorTheme="neutral100">
      {/* //cmt: row of created date */}
      <Block
        flexDirection="row"
        alignItems="center"
        paddingHorizontal={16}
        justifyContent="space-between">
        <Block
          flexDirection="row"
          alignItems="center"
          paddingBottom={6}
          columnGap={2}>
          <Icon icon="timer_fill" size={12} colorTheme="neutral600" />
          <Text
            text={dayjs(orderDetail?.CreatedDate).format('HH:mm DD/MM/YYYY')}
            fontStyle="Body12Med"
            colorTheme="neutral600"
          />
        </Block>
      </Block>
      {/* //cmt: send mail + status dropdown */}
      <Block
        flexDirection="row"
        alignItems="center"
        marginTop={4}
        marginBottom={12}
        paddingHorizontal={16}
        columnGap={12}>
        <TouchableScale
          style={{ flex: 1 }}
          onPress={onShowStatusOption}
          activeOpacity={ActiveOpacity}>
          <Block
            paddingVertical={8}
            paddingLeft={8}
            paddingRight={6}
            flexDirection="row"
            colorTheme="neutral50"
            borderColorTheme="neutral200"
            borderWidth={5}
            borderRadius={4}
            alignItems="center">
            <Block
              flexDirection="row"
              alignItems="center"
              columnGap={8}
              flex={1}>
              <Icon
                icon={status?.icon}
                size={16}
                colorTheme={status?.iconColorTheme}
              />
              <Text
                t18n={status?.t18n}
                fontStyle="Body14Reg"
                colorTheme="neutral900"
              />
            </Block>
            <Icon
              icon="arrow_ios_down_fill"
              size={16}
              colorTheme="neutral900"
            />
          </Block>
        </TouchableScale>
        <TouchableScale
          style={{ flex: 1 }}
          onPress={() => {
            navigate(APP_SCREEN.ORDER_EMAIL);
          }}
          activeOpacity={ActiveOpacity}>
          <Block
            paddingVertical={8}
            paddingLeft={8}
            paddingRight={6}
            flexDirection="row"
            colorTheme="primary50"
            borderColorTheme="primary200"
            borderWidth={5}
            borderRadius={4}
            justifyContent="center"
            columnGap={8}
            alignItems="center">
            <Icon
              icon="send_mail_outline"
              size={20}
              colorTheme="secondary900"
            />
            <Text
              t18n="order_detail:send_email"
              fontStyle="Body14Semi"
              colorTheme="secondary900"
            />
          </Block>
        </TouchableScale>
      </Block>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Block
          flexDirection="row"
          alignItems="center"
          columnGap={4}
          paddingTop={4}
          paddingHorizontal={12}>
          {orderDetail?.Message?.toUpperCase().includes('SANDBOX') && (
            <Block
              paddingLeft={8}
              paddingRight={6}
              colorTheme="error50"
              borderRadius={24}
              paddingVertical={4}>
              <Text
                text="SANDBOX"
                fontStyle="Body12Reg"
                colorTheme="error500"
              />
            </Block>
          )}
          {orderDetail?.AgentId !== currentAccount?.AgentId && (
            <Block
              flexDirection="row"
              alignItems="center"
              columnGap={4}
              colorTheme="neutral50"
              borderRadius={24}
              paddingVertical={4}
              paddingLeft={8}
              paddingRight={6}>
              <Text
                text={translate('order:customer') + ':'}
                fontStyle="Body12Reg"
                colorTheme="neutral700"
              />
              <Text fontStyle="Body12Reg" colorTheme="neutral700">
                {orderDetail?.SubAgCode}
                {orderDetail?.SubAgName !== null && (
                  <Text
                    text={` - ${orderDetail?.SubAgName}`}
                    fontStyle="Body12Reg"
                    colorTheme="neutral700"
                  />
                )}
              </Text>
            </Block>
          )}
          {
            //@ts-ignore
            orderDetail?.SubAgId !== orderDetail?.AgentId && (
              <Block
                flexDirection="row"
                alignItems="center"
                columnGap={4}
                colorTheme="neutral50"
                borderRadius={24}
                paddingVertical={4}
                paddingLeft={8}
                paddingRight={6}>
                <Text
                  text={translate('order:agent_booking') + ':'}
                  fontStyle="Body12Reg"
                  colorTheme="neutral700"
                />
                <Text fontStyle="Body12Reg" colorTheme="neutral700">
                  {orderDetail?.AgentCode}
                  {orderDetail?.AgentName !== null && (
                    <Text
                      text={` - ${orderDetail?.AgentName}`}
                      fontStyle="Body12Reg"
                      colorTheme="neutral700"
                    />
                  )}
                </Text>
              </Block>
            )
          }
          <Block
            flexDirection="row"
            alignItems="center"
            columnGap={4}
            colorTheme="neutral50"
            borderRadius={24}
            paddingVertical={4}
            paddingLeft={8}
            paddingRight={6}>
            <Text
              text={translate('order:created_user') + ':'}
              fontStyle="Body12Reg"
              colorTheme="neutral700"
            />
            <Text
              //@ts-ignore
              text={`${orderDetail?.CreatedUser}`}
              fontStyle="Body12Reg"
              colorTheme="neutral700"
            />
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
};
