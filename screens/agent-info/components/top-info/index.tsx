import { images } from '@assets/image';
import { Block, Image } from '@vna-base/components';
import React from 'react';
import { useStyles } from './style';

export const TopInfo = () => {
  const styles = useStyles();

  // render
  return (
    <Block
      colorTheme="neutral50"
      paddingVertical={16}
      rowGap={16}
      paddingHorizontal={12}>
      {/* // cmt:header info  */}
      <Block style={styles.avatarContainer}>
        <Image containerStyle={styles.avatar} source={images.agent_logo} />
      </Block>
      {/* <Block colorTheme="neutral100" borderRadius={12} overflow="hidden">
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
      </Block> */}
    </Block>
  );
};
