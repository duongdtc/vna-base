/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Text } from '@vna-base/components';
import { selectRefundDoc } from '@redux-selector';
import { translate } from '@vna-base/translations/translate';
import { CurrencyDetails, WindowWidth } from '@vna-base/utils';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const ContentModalCalculateFee = () => {
  const arrayRefundDoc = useSelector(selectRefundDoc);

  // giá vé = baseFare, Thuế = totalTax, Tổng giá = baseFare + totalTax
  // Đã sử dụng = UsedFare, Được hoàn lại = Tổng giá - Đã sử dụng
  // Phí hoàn = RefundFare, Tổng hoàn = Được hoàn lại - Phí hoàn
  const getPrice = useMemo(() => {
    let totalBaseFare = 0;
    let totalTax = 0;
    let totalUseFare = 0;
    let totalRefundFare = 0;

    arrayRefundDoc.forEach(doc => {
      totalBaseFare += doc.BaseFare!.Amount!;
      totalTax += doc.TotalTax!.Amount!;
      totalUseFare += doc.UsedFare!.Amount!;
      totalRefundFare += doc.RefundFare!.Amount!;
    });

    const totalPrice = totalBaseFare + totalTax;
    const totalBeRefunded = totalPrice - totalUseFare;
    const totalAll = totalBeRefunded - totalRefundFare;

    return {
      TotalBaseFare: totalBaseFare.currencyFormat(),
      TotalTax: totalTax.currencyFormat(),
      TotalPrice: totalPrice.currencyFormat(),
      TotalUseFare: totalUseFare.currencyFormat(),
      TotalBeRefunded: totalBeRefunded.currencyFormat(),
      TotalRefundFare: totalRefundFare.currencyFormat(),
      TotalAll: totalAll.currencyFormat(),
    };
  }, [arrayRefundDoc]);

  return (
    <Block
      colorTheme="neutral100"
      borderRadius={12}
      padding={12}
      rowGap={12}
      style={{ marginTop: -24, marginBottom: -12 }}
      width={WindowWidth - 48}
      alignSelf="center">
      <Block
        colorTheme="neutral50"
        borderRadius={8}
        padding={12}
        overflow="hidden">
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="flight:fare"
            fontStyle="Body14Reg"
            colorTheme="neutral900"
          />
          <Text
            text={getPrice.TotalBaseFare}
            fontStyle="Body14Semi"
            colorTheme="neutral900"
          />
        </Block>
        <Block
          width={'100%'}
          height={1}
          marginVertical={12}
          colorTheme="neutral200"
        />
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="refund_ticket:tax"
            fontStyle="Body14Reg"
            colorTheme="neutral900"
          />
          <Text
            text={getPrice.TotalTax}
            fontStyle="Body14Semi"
            colorTheme="neutral900"
          />
        </Block>
        <Block
          width={'100%'}
          height={1}
          marginVertical={12}
          colorTheme="neutral200"
        />
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            text={translate('order_detail:total_fare').replace(':', '')}
            fontStyle="Body14Reg"
            colorTheme="neutral900"
          />
          <Text
            text={getPrice.TotalPrice}
            fontStyle="Title16Semi"
            colorTheme="neutral900"
          />
        </Block>
      </Block>
      <Block paddingHorizontal={12} paddingVertical={4}>
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="refund_ticket:used"
            fontStyle="Body14Reg"
            colorTheme="neutral900"
          />
          <Text
            text={getPrice.TotalUseFare}
            fontStyle="Body14Semi"
            colorTheme="error500"
          />
        </Block>
        <Block
          width={'100%'}
          height={1}
          marginVertical={12}
          colorTheme="neutral200"
        />
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="refund_ticket:be_rfnded"
            fontStyle="Body14Reg"
            colorTheme="neutral900"
          />
          <Text
            text={getPrice.TotalBeRefunded}
            fontStyle="Body14Semi"
            colorTheme="success500"
          />
        </Block>
        <Block
          width={'100%'}
          height={1}
          marginVertical={12}
          colorTheme="neutral200"
        />
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="refund_ticket:fee_rfnd"
            fontStyle="Body14Reg"
            colorTheme="neutral900"
          />
          <Text
            text={getPrice.TotalRefundFare}
            fontStyle="Body14Semi"
            colorTheme="error500"
          />
        </Block>
        <Block
          width={'100%'}
          height={1}
          marginVertical={12}
          colorTheme="neutral200"
        />
        <Block
          width={'100%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="refund_ticket:total_rfnd"
            fontStyle="Body14Semi"
            colorTheme="neutral800"
          />
          <Text fontStyle="Title16Bold" colorTheme="success500">
            {`${getPrice.TotalAll} `}
            <Text
              t18n={CurrencyDetails.VND.symbol}
              fontStyle="Title16Semi"
              colorTheme="neutral900"
            />
          </Text>
        </Block>
      </Block>
    </Block>
  );
};
