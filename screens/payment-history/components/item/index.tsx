import { Block, Icon, Text } from '@vna-base/components';
import { selectAllAgent } from '@vna-base/redux/selector';
import { PaymentHistoryInList } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import { scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';
import { RealmObject } from 'realm/dist/public-types/Object';

type Props = {
  id: string;
};

export const Item = memo(({ id }: Props) => {
  const paymentDetail =
    realmRef.current?.objectForPrimaryKey<PaymentHistoryInList>(
      PaymentHistoryInList.schema.name,
      id,
    ) ??
    ({} as RealmObject<PaymentHistoryInList, never> & PaymentHistoryInList);

  const allAgents = useSelector(selectAllAgent);

  const agent = allAgents[paymentDetail.PaidAgent as string];

  return (
    <Block
      paddingHorizontal={16}
      paddingVertical={12}
      rowGap={8}
      colorTheme="neutral100">
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text
          text={paymentDetail?.Title?.toUpperCase()}
          fontStyle="Title16Semi"
          colorTheme="neutral900"
        />
        <Text
          text={dayjs(paymentDetail.PaymentDate).format('DD/MM/YYYY HH:mm')}
          fontStyle="Capture11Reg"
          colorTheme="neutral600"
        />
      </Block>

      <Block flexDirection="row" alignItems="center" columnGap={8}>
        <Icon
          // icon={isPositive ? 'log_in_fill' : 'log_out_fill'}
          // colorTheme={isPositive ? 'success500' : 'error500'}
          colorTheme="error500"
          icon="log_out_fill"
          size={28}
        />
        <Block rowGap={2} flex={1}>
          <Text
            text={`${translate('payment_history:ref_num')}: ${
              paymentDetail.RefNumb
            }`}
            fontStyle="Body12Med"
            colorTheme="neutral700"
          />
          <Text
            text={paymentDetail.Amount?.currencyFormat()}
            fontStyle="Body14Semi"
            colorTheme="error500"
          />
        </Block>
        <Block rowGap={2} alignItems="flex-end">
          <Text
            t18n="payment_history:balance"
            fontStyle="Capture11Reg"
            colorTheme="neutral700"
          />
          <Text
            text={paymentDetail.Balance?.currencyFormat()}
            fontStyle="Capture11Reg"
            colorTheme={
              (paymentDetail.Balance ?? 0) > 0 ? 'success500' : 'error500'
            }
          />
        </Block>
      </Block>
      {agent && (
        <Block
          alignSelf="flex-start"
          paddingVertical={4}
          paddingLeft={8}
          paddingRight={6}
          colorTheme="neutral50"
          style={{ borderRadius: scale(20) }}>
          <Text
            fontStyle="Body12Reg"
            colorTheme="neutral700"
            text={`${translate('payment_history:agent')}: ${
              agent.AgentCode
            } - ${agent.AgentName}`}
          />
        </Block>
      )}
    </Block>
  );
}, isEqual);
