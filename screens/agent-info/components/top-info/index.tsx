import { images } from '@assets/image';
import { Block, Image, Separator, Text } from '@vna-base/components';
import { selectBalanceInfo, selectCurrentAccount } from '@vna-base/redux/selector';
import { translate } from '@vna-base/translations/translate';
import { CurrencyDetails } from '@vna-base/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from './style';

export const TopInfo = () => {
  const styles = useStyles();

  const { Agent } = useSelector(selectCurrentAccount);
  const { balance, creditLimit } = useSelector(selectBalanceInfo);

  // render
  return (
    <Block
      colorTheme="neutral50"
      paddingVertical={16}
      rowGap={16}
      paddingHorizontal={12}>
      {/* // cmt:header info  */}
      <Block style={styles.avatarContainer}>
        <Image
          containerStyle={styles.avatar}
          source={Agent?.Logo ?? images.default_avatar}
        />
      </Block>
      <Block colorTheme="neutral100" borderRadius={12} overflow="hidden">
        {/* //cmt: số dư */}
        <Block
          rowGap={4}
          paddingVertical={12}
          paddingHorizontal={16}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            text={translate('agent:surplus').replace(':', '')}
            fontStyle="Body16Reg"
            colorTheme="neutral900"
          />
          <Text
            text={balance.currencyFormat()}
            fontStyle="Body14Semi"
            colorTheme={balance > 0 ? 'success500' : 'error500'}
          />
        </Block>
        <Separator type="horizontal" size={3} />
        {/* //cmt: tiền đặt cọc */}
        <Block
          rowGap={4}
          paddingVertical={12}
          paddingHorizontal={16}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="system:deposits"
            fontStyle="Body16Reg"
            colorTheme="neutral900"
          />
          <Text
            text={Agent?.Deposit?.currencyFormat() ?? '0'}
            fontStyle="Body14Semi"
            colorTheme="neutral800"
          />
        </Block>
        <Separator type="horizontal" size={3} />
        {/* //cmt: tiền bảo lãnh */}
        <Block
          rowGap={4}
          paddingVertical={12}
          paddingHorizontal={16}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="system:guarantee_money"
            fontStyle="Body16Reg"
            colorTheme="neutral900"
          />
          <Text
            text={Agent?.Guarantee?.currencyFormat() ?? '0'}
            fontStyle="Body14Semi"
            colorTheme="neutral800"
          />
        </Block>
        <Separator type="horizontal" size={3} />
        {/* //cmt: hạn mức nợ */}
        <Block
          rowGap={4}
          paddingVertical={12}
          paddingHorizontal={16}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="system:debt_limit"
            fontStyle="Body16Reg"
            colorTheme="neutral900"
          />
          <Text
            text={creditLimit.currencyFormat() ?? '0'}
            fontStyle="Body14Semi"
            colorTheme="neutral800"
          />
        </Block>
        <Separator type="horizontal" size={3} />
        {/* //cmt: hạn mức nợ */}
        <Block
          rowGap={4}
          padding={16}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="common:amount_allowed"
            fontStyle="Title16Semi"
            colorTheme="neutral900"
          />
          <Text
            fontStyle="Body14Semi"
            colorTheme={creditLimit + balance < 0 ? 'error500' : 'price'}>
            {`${(creditLimit + balance).currencyFormat()} `}
            <Text
              t18n={CurrencyDetails.VND.symbol}
              fontStyle="Body14Semi"
              colorTheme="neutral900"
            />
          </Text>
        </Block>
      </Block>
    </Block>
  );
};
