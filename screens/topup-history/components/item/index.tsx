/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IconTypes } from '@assets/icon';
import { navigate } from '@navigation/navigation-service';
import { TopupRealm } from '@services/realm/models';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import { APP_SCREEN } from '@utils';
import { Block, Icon, Text } from '@vna-base/components';
import { selectAllTypeTopup } from '@vna-base/redux/selector';
import { translate } from '@vna-base/translations/translate';
import { TopupMethod, TopupMethodDetails } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';

type Props = {
  item: TopupRealm;
};

export const Item = memo(({ item }: Props) => {
  const allTypes = useSelector(selectAllTypeTopup);

  const isPositive = (item.Amount ?? 0) > 0;

  let iconStatus: IconTypes = 'refresh_fill';
  let colorThemeStatus: keyof Colors = 'warning600';
  let t18nStatus: I18nKeys = 'common:processing';

  if (item.Approved) {
    iconStatus = 'checkmark_circle_fill';
    colorThemeStatus = 'success600';
    t18nStatus = 'common:success';
  } else if (item.Approved === false) {
    iconStatus = 'close_circle_fill';
    colorThemeStatus = 'error600';
    t18nStatus = 'common:failed';
  }

  return (
    <Pressable
      onPress={() => {
        navigate(APP_SCREEN.TOPUP_DETAIL, {
          id: item.Id,
        });
      }}>
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
            text={(allTypes[item.EntryType!]?.ViewVi ?? '').toUpperCase()}
            fontStyle="Title16Semi"
            colorTheme="neutral900"
          />
          <Text
            text={dayjs(item.CreatedDate).format('DD/MM/YYYY HH:mm')}
            fontStyle="Capture11Reg"
            colorTheme="neutral600"
          />
        </Block>

        <Block flexDirection="row" alignItems="center" columnGap={8}>
          <Icon
            icon={isPositive ? 'log_in_fill' : 'log_out_fill'}
            colorTheme={isPositive ? 'success500' : 'error500'}
            size={28}
          />
          <Block rowGap={2} flex={1}>
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Block flex={1}>
                <Text
                  t18n={
                    TopupMethodDetails[item.PaymentMethod as TopupMethod].t18n
                  }
                  fontStyle="Body12Med"
                  colorTheme="neutral700"
                />
              </Block>

              <Block flexDirection="row" columnGap={2} alignItems="center">
                <Icon
                  icon={iconStatus}
                  size={13}
                  colorTheme={colorThemeStatus}
                />
                <Text
                  t18n={t18nStatus}
                  fontStyle="Body12Reg"
                  colorTheme="neutral900"
                />
              </Block>
            </Block>

            <Block flexDirection="row" columnGap={4} alignItems="center">
              <Block>
                <Text
                  text={`${isPositive ? '+' : ''}${(
                    item.Amount ?? 0
                  ).currencyFormat()}`}
                  fontStyle="Body14Semi"
                  colorTheme={isPositive ? 'success500' : 'error500'}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                />
              </Block>
              <Block flex={1} />

              <Block>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  fontStyle="Capture11Reg"
                  colorTheme="neutral700">
                  {translate('transaction_history:balance')}:{' '}
                  <Text
                    fontStyle="Capture11Reg"
                    colorTheme={
                      (item.Balance ?? 0) > 0 ? 'success500' : 'error500'
                    }
                    text={item.Balance?.currencyFormat()}
                  />
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Pressable>
  );
}, isEqual);
