/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IconTypes } from '@assets/icon';
import { Block, Icon, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectAllTypeTopup } from '@redux-selector';
import { TopupRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import { TopupMethod, TopupMethodDetails } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { RealmObject } from 'realm/dist/public-types/Object';
import { APP_SCREEN } from '@utils';

type Props = {
  id: string;
};

export const Item = memo(({ id }: Props) => {
  const allTypes = useSelector(selectAllTypeTopup);
  const topupDetail =
    realmRef.current?.objectForPrimaryKey<TopupRealm>(
      TopupRealm.schema.name,
      id,
    ) ?? ({} as RealmObject<TopupRealm, never> & TopupRealm);

  const isPositive = (topupDetail.Amount ?? 0) > 0;

  let iconStatus: IconTypes = 'refresh_fill';
  let colorThemeStatus: keyof Colors = 'warning600';
  let t18nStatus: I18nKeys = 'common:processing';

  if (topupDetail.Approved) {
    iconStatus = 'checkmark_circle_fill';
    colorThemeStatus = 'success600';
    t18nStatus = 'common:success';
  } else if (topupDetail.Approved === false) {
    iconStatus = 'close_circle_fill';
    colorThemeStatus = 'error600';
    t18nStatus = 'common:failed';
  }

  return (
    <Pressable
      onPress={() => {
        navigate(APP_SCREEN.TOPUP_DETAIL, {
          id,
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
            text={(
              allTypes[topupDetail.EntryType!]?.ViewVi ?? ''
            ).toUpperCase()}
            fontStyle="Title16Semi"
            colorTheme="neutral900"
          />
          <Text
            text={dayjs(topupDetail.CreatedDate).format('DD/MM/YYYY HH:mm')}
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
                    TopupMethodDetails[topupDetail.PaymentMethod as TopupMethod]
                      .t18n
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
                    topupDetail.Amount ?? 0
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
                      (topupDetail.Balance ?? 0) > 0 ? 'success500' : 'error500'
                    }
                    text={topupDetail.Balance?.currencyFormat()}
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
