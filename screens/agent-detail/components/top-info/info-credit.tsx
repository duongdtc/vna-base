import { Block, Icon, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectAgentDetailById } from '@vna-base/redux/selector';
import { convertStringToNumber, CurrencyDetails } from '@vna-base/utils';
import React, { memo, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '@utils';

export const InfoCredit = memo(() => {
  const [isHide, setIsHideMoneyInfo] = useState(true);
  const agentDetail = useSelector(selectAgentDetailById);

  const navToCreditInfo = () => {
    navigate(APP_SCREEN.CREDIT_INFO, { id: agentDetail.Id! });
  };

  const totalFund = useMemo(
    () =>
      (
        (agentDetail?.CreditLimit ?? 0) + (agentDetail?.Balance ?? 0)
      ).currencyFormat(),
    [agentDetail.Balance, agentDetail.CreditLimit],
  );

  return (
    <Block paddingHorizontal={16} paddingVertical={8}>
      <Block rowGap={2}>
        <Pressable onPress={() => setIsHideMoneyInfo(!isHide)}>
          <Block flexDirection="row" alignItems="center" columnGap={2}>
            <Text
              t18n="common:amount_allowed"
              fontStyle="Body12Med"
              colorTheme="neutral600"
            />
            <Icon
              icon={isHide ? 'eye_off_fill' : 'eye_fill'}
              size={14}
              colorTheme="neutral600"
            />
          </Block>
        </Pressable>
        <Pressable onPress={navToCreditInfo}>
          <Block flexDirection="row" alignItems="center" columnGap={2}>
            <Text
              fontStyle="Title20Semi"
              colorTheme={
                convertStringToNumber(totalFund) < 0 ? 'error500' : 'success500'
              }>
              {isHide ? '**********' : `${totalFund} `}
              <Text
                text={isHide ? '' : CurrencyDetails.VND.symbol}
                fontStyle="Title20Semi"
                colorTheme="neutral900"
              />
            </Text>
            <Icon
              icon="arrow_ios_right_fill"
              size={20}
              colorTheme="neutral900"
            />
          </Block>
        </Pressable>
      </Block>
    </Block>
  );
}, isEqual);
