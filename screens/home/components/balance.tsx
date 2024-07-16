import { Icon, Text } from '@vna-base/components';
import { selectCurrentAccount } from '@redux-selector';
import { bs, useStyles } from '@theme';
import { ActiveOpacity, CurrencyDetails, HitSlop } from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet } from 'react-native-unistyles';
import { useSelector } from 'react-redux';

export const Balance = memo(() => {
  const { styles } = useStyles(styleSheet);
  const currentAccount = useSelector(selectCurrentAccount);

  const totalFund = useMemo(
    () =>
      (
        (currentAccount.Agent?.CreditLimit ?? 0) +
        (currentAccount.Agent?.Balance ?? 0)
      ).currencyFormat(),
    [currentAccount.Agent],
  );

  return (
    <View style={styles.container}>
      <View
        style={[bs.flex, bs.flexDirectionRow, bs.alignCenter, bs.columnGap_2]}>
        <Icon icon="cash_stack_fill" size={20} colorTheme="primaryColor" />
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          style={[bs.flexDirectionRow, bs.alignCenter, bs.columnGap_2]}
          hitSlop={HitSlop.Large}
          onPress={() => {}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            text={totalFund}
            fontStyle="Body14Semi"
            colorTheme="neutral100"
          />
          <Text
            text={CurrencyDetails.VND.symbol}
            fontStyle="Body14Semi"
            colorTheme="neutral100"
          />
          <Icon icon="arrow_ios_right_fill" size={14} colorTheme="neutral100" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.transactionActionContainer}
        activeOpacity={ActiveOpacity}
        onPress={() => {}}>
        <Icon icon="archive_outline" size={20} colorTheme="primaryColor" />
        <Text
          t18n="home:withdraw"
          colorTheme="neutral100"
          fontStyle="Body10Reg"
        />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity
        style={styles.transactionActionContainer}
        activeOpacity={ActiveOpacity}
        onPress={() => {}}>
        <Icon icon="topup_wallet_outline" size={20} colorTheme="primaryColor" />
        <Text
          t18n="home:top_up"
          colorTheme="neutral100"
          fontStyle="Body10Reg"
        />
      </TouchableOpacity>
    </View>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, shadows, spacings }) => ({
  container: {
    marginHorizontal: spacings[12],
    backgroundColor: colors.neutral10,
    borderRadius: spacings[8],
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacings[12],
    columnGap: spacings[12],
    ...shadows.small,
  },
  separator: {
    height: spacings[32],
    width: 1,
    backgroundColor: colors.neutral20,
  },

  transactionActionContainer: {
    rowGap: spacings[2],
    alignItems: 'center',
  },
}));
