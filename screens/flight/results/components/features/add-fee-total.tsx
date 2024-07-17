import { Block, Text } from '@vna-base/components';
import { selectListRoute, selectSearchForm } from '@vna-base/redux/selector';
import { CustomFeeForm } from '@vna-base/screens/flight/type';
import { translate } from '@vna-base/translations/translate';
import { calTotalCustomFee } from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';

export const AddFeeTotal = memo(() => {
  const { control } = useFormContext<CustomFeeForm>();
  const { Passengers } = useSelector(selectSearchForm);
  const routes = useSelector(selectListRoute);

  const listData = useWatch({
    control,
    name: ['ADT', 'CHD', 'INF', 'applyFLight', 'applyPassenger'],
  });

  const total = useMemo(
    () =>
      calTotalCustomFee(
        {
          ADT: listData[0],
          CHD: listData[1],
          INF: listData[2],
          applyFLight: listData[3],
          applyPassenger: listData[4],
        },
        Passengers,
        routes,
      ),
    [Passengers, listData, routes],
  );

  return (
    <Block
      paddingHorizontal={4}
      flexDirection="row"
      alignItems="center"
      paddingVertical={4}
      justifyContent="space-between">
      <Text
        text={translate('common:total') + ':'}
        fontStyle="Body14Semi"
        colorTheme="neutral800"
      />
      <Text fontStyle="Title20Semi" colorTheme="price">
        {total.currencyFormat()} <Text text="VND" />
      </Text>
    </Block>
  );
}, isEqual);
